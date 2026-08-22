import React from 'react';
import { PersonalInfo } from '../../types/resume';
import { User, Mail, Phone, MapPin, Globe, Linkedin, Github, Image as ImageIcon } from 'lucide-react';
import { SpellCheckedInput } from './SpellCheckedInput';

interface PersonalInfoFormProps {
  data: PersonalInfo;
  onChange: (data: PersonalInfo) => void;
  onOpenLinkedInModal?: () => void;
}

export const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ data, onChange, onOpenLinkedInModal }) => {
  const safeData: PersonalInfo = data || {
    fullName: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
  };

  const handleChange = (field: keyof PersonalInfo, value: string) => {
    onChange({
      ...safeData,
      [field]: value,
    });
  };

  return (
    <div className="space-y-4">
      <div className="border-b border-slate-200 pb-3 flex items-center justify-between gap-2 flex-wrap">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600" /> Personal & Contact Details
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Your full name, job target title, and ATS-parseable contact channels.
          </p>
        </div>

        {onOpenLinkedInModal && (
          <button
            type="button"
            onClick={onOpenLinkedInModal}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors cursor-pointer"
          >
            <Linkedin className="w-3.5 h-3.5 text-blue-600" />
            <span>Auto-fill from LinkedIn</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Full Name <span className="text-rose-500">*</span>
          </label>
          <SpellCheckedInput
            id="input-full-name"
            value={safeData.fullName || ''}
            onChange={(val) => handleChange('fullName', val)}
            placeholder="e.g. Alexander Wright"
            inputClassName="py-2"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Professional Title / Target Role <span className="text-rose-500">*</span>
          </label>
          <SpellCheckedInput
            id="input-job-title"
            value={safeData.title || ''}
            onChange={(val) => handleChange('title', val)}
            placeholder="e.g. Senior Full-Stack Software Engineer"
            inputClassName="py-2"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Email Address <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              id="input-email"
              type="email"
              value={safeData.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="alex.wright@email.com"
              className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-800"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
          <div className="relative">
            <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              id="input-phone"
              type="tel"
              value={safeData.phone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+1 (555) 234-8901"
              className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-800"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
          <SpellCheckedInput
            id="input-location"
            value={safeData.location || ''}
            onChange={(val) => handleChange('location', val)}
            placeholder="San Francisco, CA"
            leftIcon={<MapPin className="w-3.5 h-3.5 text-slate-400" />}
            inputClassName="py-2"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">LinkedIn Profile</label>
          <div className="relative">
            <Linkedin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              id="input-linkedin"
              type="text"
              value={safeData.linkedin || ''}
              onChange={(e) => handleChange('linkedin', e.target.value)}
              placeholder="linkedin.com/in/username"
              className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-800"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Portfolio / Website</label>
          <div className="relative">
            <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              id="input-website"
              type="text"
              value={safeData.website || ''}
              onChange={(e) => handleChange('website', e.target.value)}
              placeholder="https://yourportfolio.com"
              className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-800"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">GitHub / Code Link</label>
          <div className="relative">
            <Github className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              id="input-github"
              type="text"
              value={safeData.github || ''}
              onChange={(e) => handleChange('github', e.target.value)}
              placeholder="github.com/username"
              className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-800"
            />
          </div>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Photo URL <span className="text-slate-400 font-normal">(Optional for templates with avatar support)</span>
          </label>
          <div className="relative">
            <ImageIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              id="input-photo-url"
              type="url"
              value={safeData.photoUrl || ''}
              onChange={(e) => handleChange('photoUrl', e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-800"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
