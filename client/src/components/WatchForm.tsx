/**
 * Watch Form Component - Add/Edit Watch
 * Handles all watch data input with image upload support
 */

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Watch, MovementType, WatchFormData } from "@/types";

interface WatchFormProps {
  initialData?: Watch;
  onSubmit: (data: WatchFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const MOVEMENT_TYPES: MovementType[] = ["mechanical", "automatic", "quartz", "chronograph", "tourbillon"];
const currentYear = new Date().getFullYear();

const isValidImageSource = (value: string) => {
  if (value.startsWith("data:")) return value.startsWith("data:image/");

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

export function WatchForm({ initialData, onSubmit, onCancel, isLoading = false }: WatchFormProps) {
  const [formData, setFormData] = useState<WatchFormData>(
    initialData
      ? {
          name: initialData.name,
          brand: initialData.brand,
          model: initialData.model,
          referenceNumber: initialData.referenceNumber,
          purchasePrice: initialData.purchasePrice,
          currentMarketValue: initialData.currentMarketValue,
          purchaseDate: initialData.purchaseDate,
          year: initialData.year,
          movementType: initialData.movementType,
          caseSize: initialData.caseSize,
          notes: initialData.notes,
          brandLogoUrl: initialData.brandLogoUrl,
          heroImageUrl: initialData.heroImageUrl,
          galleryImages: initialData.galleryImages,
          listingUrl: initialData.listingUrl ?? "",
        }
      : {
          name: "",
          brand: "",
          model: "",
          referenceNumber: "",
          purchasePrice: 0,
          currentMarketValue: 0,
          purchaseDate: new Date().toISOString().split("T")[0],
          year: new Date().getFullYear(),
          movementType: "automatic",
          caseSize: 42,
          notes: "",
          brandLogoUrl: "",
          heroImageUrl: "",
          galleryImages: [],
          listingUrl: "",
        }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageInputMode, setImageInputMode] = useState<"upload" | "url">("upload");
  const [imageUrlInput, setImageUrlInput] = useState<{ brandLogo: string; heroImage: string }>({
    brandLogo: "",
    heroImage: "",
  });
  const brandLogoInputRef = useRef<HTMLInputElement>(null);
  const heroImageInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "purchasePrice" || name === "currentMarketValue" || name === "year" || name === "caseSize" ? parseFloat(value) : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: name === "year" || name === "caseSize" ? parseFloat(value) : value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: "brandLogoUrl" | "heroImageUrl") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFormData((prev) => ({ ...prev, [field]: "" }));
      setErrors((prev) => ({ ...prev, [field]: "Please upload a valid image file" }));
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (typeof dataUrl !== "string" || !isValidImageSource(dataUrl)) {
        setErrors((prev) => ({ ...prev, [field]: "Please upload a valid image file" }));
        return;
      }
      setFormData((prev) => ({
        ...prev,
        [field]: dataUrl,
      }));
      setErrors((prev) => ({ ...prev, [field]: "" }));
    };
    reader.onerror = () => {
      setErrors((prev) => ({ ...prev, [field]: "The image could not be uploaded" }));
    };
    reader.readAsDataURL(file);
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target?.result as string;
          setFormData((prev) => ({
            ...prev,
            galleryImages: [...prev.galleryImages, dataUrl],
          }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeGalleryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    const maxYear = new Date().getFullYear();

    if (!formData.name.trim()) newErrors.name = "Watch name is required";
    if (!formData.brand.trim()) newErrors.brand = "Brand is required";
    if (!formData.model.trim()) newErrors.model = "Model is required";
    if (!Number.isFinite(formData.purchasePrice) || formData.purchasePrice < 0) newErrors.purchasePrice = "Purchase price must be zero or greater";
    if (!Number.isFinite(formData.currentMarketValue) || formData.currentMarketValue < 0) newErrors.currentMarketValue = "Current value must be zero or greater";
    if (!Number.isInteger(formData.year) || formData.year < 1900 || formData.year > maxYear) newErrors.year = `Year should be between 1900-${maxYear}`;
    if (!Number.isFinite(formData.caseSize) || formData.caseSize < 20 || formData.caseSize > 60) newErrors.caseSize = "Case size should be between 20-60mm";
    if (!formData.heroImageUrl) {
      newErrors.heroImageUrl = errors.heroImageUrl || "No image was uploaded";
    } else if (!isValidImageSource(formData.heroImageUrl)) {
      newErrors.heroImageUrl = "Please upload a valid image file";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <Card className="glass p-6">
        <h3 className="text-lg font-display font-bold mb-6">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Watch Name *</label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Submariner Date"
              className="bg-input border-border"
              disabled={isLoading}
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Brand *</label>
            <Input
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              placeholder="e.g., Rolex"
              className="bg-input border-border"
              disabled={isLoading}
            />
            {errors.brand && <p className="text-red-400 text-xs mt-1">{errors.brand}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Model *</label>
            <Input
              name="model"
              value={formData.model}
              onChange={handleInputChange}
              placeholder="e.g., 116610LN"
              className="bg-input border-border"
              disabled={isLoading}
            />
            {errors.model && <p className="text-red-400 text-xs mt-1">{errors.model}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Reference Number</label>
            <Input
              name="referenceNumber"
              value={formData.referenceNumber}
              onChange={handleInputChange}
              placeholder="e.g., 116610LN-0001"
              className="bg-input border-border"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Year Acquired</label>
            <Input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              min="1900"
              max={currentYear}
              className="bg-input border-border"
              disabled={isLoading}
            />
            {errors.year && <p className="text-red-400 text-xs mt-1">{errors.year}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Purchase Date</label>
            <Input
              type="date"
              name="purchaseDate"
              value={formData.purchaseDate}
              onChange={handleInputChange}
              className="bg-input border-border"
              disabled={isLoading}
            />
          </div>
        </div>
      </Card>

      {/* Pricing & Specifications */}
      <Card className="glass p-6">
        <h3 className="text-lg font-display font-bold mb-6">Pricing & Specifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Purchase Price (₹) *</label>
            <Input
              type="number"
              name="purchasePrice"
              value={formData.purchasePrice}
              onChange={handleInputChange}
              placeholder="0"
              className="bg-input border-border"
              disabled={isLoading}
            />
            {errors.purchasePrice && <p className="text-red-400 text-xs mt-1">{errors.purchasePrice}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Current Market Value (₹) *</label>
            <Input
              type="number"
              name="currentMarketValue"
              value={formData.currentMarketValue}
              onChange={handleInputChange}
              placeholder="0"
              className="bg-input border-border"
              disabled={isLoading}
            />
            {errors.currentMarketValue && <p className="text-red-400 text-xs mt-1">{errors.currentMarketValue}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Movement Type</label>
            <Select value={formData.movementType} onValueChange={(value) => handleSelectChange("movementType", value)}>
              <SelectTrigger className="bg-input border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MOVEMENT_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Case Size (mm)</label>
            <Input
              type="number"
              name="caseSize"
              value={formData.caseSize}
              onChange={handleInputChange}
              min="20"
              max="60"
              className="bg-input border-border"
              disabled={isLoading}
            />
            {errors.caseSize && <p className="text-red-400 text-xs mt-1">{errors.caseSize}</p>}
          </div>
        </div>
      </Card>

      {/* Images */}
      <Card className="glass p-6">
        <h3 className="text-lg font-display font-bold mb-6">Images</h3>

        {/* Brand Logo */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-semibold">Brand Logo</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setImageInputMode("upload")}
                className={`text-xs px-2 py-1 rounded ${imageInputMode === "upload" ? "bg-accent text-accent-foreground" : "bg-card text-muted-foreground"}`}
              >
                Upload
              </button>
              <button
                type="button"
                onClick={() => setImageInputMode("url")}
                className={`text-xs px-2 py-1 rounded ${imageInputMode === "url" ? "bg-accent text-accent-foreground" : "bg-card text-muted-foreground"}`}
              >
                URL
              </button>
            </div>
          </div>
          {formData.brandLogoUrl ? (
            <div className="relative w-24 h-24 mb-4">
              <img src={formData.brandLogoUrl} alt="Brand Logo" className="w-full h-full object-cover rounded-lg" />
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, brandLogoUrl: "" }))}
                className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 hover:bg-red-600"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          ) : imageInputMode === "upload" ? (
            <button
              type="button"
              onClick={() => brandLogoInputRef.current?.click()}
              className="w-full border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-accent transition-colors"
            >
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Click to upload brand logo</p>
            </button>
          ) : (
            <Input
              type="url"
              placeholder="https://example.com/logo.png"
              value={imageUrlInput.brandLogo}
              onChange={(e) => {
                setImageUrlInput((prev) => ({ ...prev, brandLogo: e.target.value }));
              }}
              onBlur={() => {
                if (imageUrlInput.brandLogo) {
                  setFormData((prev) => ({ ...prev, brandLogoUrl: imageUrlInput.brandLogo }));
                }
              }}
              className="bg-input border-border"
              disabled={isLoading}
            />
          )}
          <input
            ref={brandLogoInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, "brandLogoUrl")}
            className="hidden"
            disabled={isLoading}
          />
        </div>

        {/* Hero Image */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-semibold">Hero Watch Image *</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setImageInputMode("upload")}
                className={`text-xs px-2 py-1 rounded ${imageInputMode === "upload" ? "bg-accent text-accent-foreground" : "bg-card text-muted-foreground"}`}
              >
                Upload
              </button>
              <button
                type="button"
                onClick={() => setImageInputMode("url")}
                className={`text-xs px-2 py-1 rounded ${imageInputMode === "url" ? "bg-accent text-accent-foreground" : "bg-card text-muted-foreground"}`}
              >
                URL
              </button>
            </div>
          </div>
          {formData.heroImageUrl ? (
            <div className="relative w-full h-48 mb-4">
              <img src={formData.heroImageUrl} alt="Hero" className="w-full h-full object-cover rounded-lg" />
              <button
                type="button"
                onClick={() => {
                  setFormData((prev) => ({ ...prev, heroImageUrl: "" }));
                  setErrors((prev) => ({ ...prev, heroImageUrl: "" }));
                }}
                className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 hover:bg-red-600"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          ) : imageInputMode === "upload" ? (
            <button
              type="button"
              onClick={() => heroImageInputRef.current?.click()}
              className="w-full border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-accent transition-colors"
            >
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Click to upload hero image</p>
            </button>
          ) : (
            <Input
              type="url"
              placeholder="https://example.com/watch.jpg"
              value={imageUrlInput.heroImage}
              onChange={(e) => {
                setImageUrlInput((prev) => ({ ...prev, heroImage: e.target.value }));
              }}
              onBlur={() => {
                if (imageUrlInput.heroImage) {
                  const heroImageUrl = imageUrlInput.heroImage.trim();
                  if (isValidImageSource(heroImageUrl)) {
                    setFormData((prev) => ({ ...prev, heroImageUrl }));
                    setErrors((prev) => ({ ...prev, heroImageUrl: "" }));
                  } else {
                    setFormData((prev) => ({ ...prev, heroImageUrl: "" }));
                    setErrors((prev) => ({ ...prev, heroImageUrl: "Please enter a valid image URL" }));
                  }
                }
              }}
              className="bg-input border-border"
              disabled={isLoading}
            />
          )}
          <input
            ref={heroImageInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, "heroImageUrl")}
            className="hidden"
            disabled={isLoading}
          />
          {errors.heroImageUrl && <p className="text-red-400 text-xs mt-1">{errors.heroImageUrl}</p>}
        </div>

        {/* Gallery Images */}
        <div>
          <label className="block text-sm font-semibold mb-4">Gallery Images ({formData.galleryImages.length})</label>
          {formData.galleryImages.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mb-4">
              {formData.galleryImages.map((image, index) => (
                <div key={index} className="relative">
                  <img src={image} alt={`Gallery ${index}`} className="w-full h-24 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={() => galleryInputRef.current?.click()}
            className="w-full border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-accent transition-colors"
          >
            <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Click to add gallery images</p>
          </button>
          <input
            ref={galleryInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleGalleryUpload}
            className="hidden"
            disabled={isLoading}
          />
        </div>
      </Card>

      {/* Notes */}
      <Card className="glass p-6">
        <h3 className="text-lg font-display font-bold mb-6">Additional Notes</h3>
        <Textarea
          name="notes"
          value={formData.notes}
          onChange={handleInputChange}
          placeholder="Add any notes about this watch (condition, history, special features, etc.)"
          className="bg-input border-border min-h-24"
          disabled={isLoading}
        />
      </Card>

      {/* Form Actions */}
      <div className="flex gap-4 justify-end">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90" disabled={isLoading}>
          {isLoading ? "Saving..." : initialData ? "Update Watch" : "Add Watch"}
        </Button>
      </div>
    </form>
  );
}
