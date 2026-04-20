"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import ImageUpload from "@/components/admin/ImageUpload";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [settings, setSettings] = useState({
    logo: { url: "", alt: "Home Breeze Logo" },
    hero: { image_url: "", title: "", subtitle: "", button_text: "" },
    contact: { phone: "", email: "", address: "" },
    deals: { active: true, banner_text: "", banner_color: "#D4AF37" }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase.from('site_settings').select('*');
      if (error) throw error;

      if (data) {
        const newSettings = { ...settings };
        data.forEach((item: any) => {
          if (item.key in newSettings) {
            (newSettings as any)[item.key] = item.value;
          }
        });
        setSettings(newSettings);
      }
    } catch (err: any) {
      console.error("Error fetching settings:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const saveSection = async (key: string, value: any) => {
    setSaving(key);
    setMessage(null);
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });

      if (error) throw error;
      setMessage({ type: 'success', text: `${key.charAt(0).toUpperCase() + key.slice(1)} settings saved successfully!` });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-serif font-bold tracking-tight text-gray-900">Site Settings</h1>
        <p className="text-muted-foreground">Manage your brand assets and global site content.</p>
      </div>

      {message && (
        <div className={`p-4 rounded-lg flex items-center gap-3 border ${
          message.type === 'success' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      {/* Brand Logo Section */}
      <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50/30">
          <div>
            <h2 className="text-lg font-serif font-semibold">Branding</h2>
            <p className="text-xs text-muted-foreground">Manage your site logo and brand identity.</p>
          </div>
          <button 
            onClick={() => saveSection('logo', settings.logo)}
            disabled={saving === 'logo'}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {saving === 'logo' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Branding
          </button>
        </div>
        <div className="p-8 max-w-sm">
          <ImageUpload 
            label="Site Logo (Square)"
            value={settings.logo.url}
            aspectRatio={1/1} 
            recommendedSize="500 x 500 px"
            onChange={(url) => setSettings({ ...settings, logo: { ...settings.logo, url } })}
            onRemove={() => setSettings({ ...settings, logo: { ...settings.logo, url: "" } })}
          />
        </div>
      </section>

      {/* Hero Section */}
      <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50/30">
          <div>
            <h2 className="text-lg font-serif font-semibold">Landing Page Hero</h2>
            <p className="text-xs text-muted-foreground">The first thing customers see on your homepage.</p>
          </div>
          <button 
            onClick={() => saveSection('hero', settings.hero)}
            disabled={saving === 'hero'}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {saving === 'hero' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Hero
          </button>
        </div>
        <div className="p-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[13px] font-semibold text-gray-900">Hero Main Title</Label>
                <Input 
                  type="text"
                  value={settings.hero.title}
                  onChange={(e) => setSettings({ ...settings, hero: { ...settings.hero, title: e.target.value } })}
                  className="h-11 rounded-lg border-gray-200 focus:ring-accent"
                  placeholder="e.g. Elevate Your Bathroom Experience"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[13px] font-semibold text-gray-900">Hero Subtitle</Label>
                <Textarea 
                  value={settings.hero.subtitle}
                  onChange={(e) => setSettings({ ...settings, hero: { ...settings.hero, subtitle: e.target.value } })}
                  className="h-32 rounded-lg border-gray-200 resize-none"
                  placeholder="e.g. Premium fixtures designed for comfort and style."
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[13px] font-semibold text-gray-900">CTA Button Text</Label>
                <Input 
                  type="text"
                  value={settings.hero.button_text}
                  onChange={(e) => setSettings({ ...settings, hero: { ...settings.hero, button_text: e.target.value } })}
                  className="h-11 rounded-lg border-gray-200 focus:ring-accent w-1/2"
                  placeholder="e.g. Shop Collection"
                />
              </div>
            </div>
          </div>
          <div className="lg:col-span-5">
            <ImageUpload 
              label="Hero Background Image"
              value={settings.hero.image_url}
              aspectRatio={16/9}
              recommendedSize="1920 x 1080 px"
              onChange={(image_url) => setSettings({ ...settings, hero: { ...settings.hero, image_url } })}
              onRemove={() => setSettings({ ...settings, hero: { ...settings.hero, image_url: "" } })}
            />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-serif font-semibold">Contact Information</h2>
          <button 
            onClick={() => saveSection('contact', settings.contact)}
            disabled={saving === 'contact'}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {saving === 'contact' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Contact
          </button>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="text-sm font-medium block mb-1">Phone Number</label>
            <input 
              type="text"
              value={settings.contact.phone}
              onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, phone: e.target.value } })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="+92 3XX XXXXXXX"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Email Address</label>
            <input 
              type="email"
              value={settings.contact.email}
              onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, email: e.target.value } })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="contact@homebreeze.com"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Address</label>
            <input 
              type="text"
              value={settings.contact.address}
              onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, address: e.target.value } })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Main Street, Karachi"
            />
          </div>
        </div>
      </section>

      {/* Deals Section */}
      <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-serif font-semibold">Promotion Deal Banner</h2>
          <button 
            onClick={() => saveSection('deals', settings.deals)}
            disabled={saving === 'deals'}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {saving === 'deals' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Deal
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <input 
              type="checkbox"
              id="deal-active"
              checked={settings.deals.active}
              onChange={(e) => setSettings({ ...settings, deals: { ...settings.deals, active: e.target.checked } })}
              className="rounded text-accent focus:ring-accent"
            />
            <label htmlFor="deal-active" className="text-sm font-medium cursor-pointer">Show Deal Banner on Homepage</label>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Banner Text</label>
            <input 
              type="text"
              value={settings.deals.banner_text}
              onChange={(e) => setSettings({ ...settings, deals: { ...settings.deals, banner_text: e.target.value } })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="e.g. Free delivery on all orders over $500!"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
