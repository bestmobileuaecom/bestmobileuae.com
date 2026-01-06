import Link from "next/link";
import { ArrowLeft, ExternalLink, Save, Check, Loader2, AlertCircle } from "lucide-react";

/**
 * FormHeader - Sticky header with save buttons and status
 */
export default function FormHeader({ 
  slug, 
  saving, 
  hasUnsavedChanges, 
  lastSaved, 
  onSaveDraft, 
  onPublish 
}) {
  return (
    <div className="sticky top-0 z-10 bg-gray-100 -mx-6 px-6 py-4 mb-6 border-b border-gray-200">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Left side: Back button and status */}
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/phones" 
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          
          <div className="flex items-center gap-2 text-sm">
            {saving ? (
              <span className="flex items-center gap-1 text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </span>
            ) : hasUnsavedChanges ? (
              <span className="flex items-center gap-1 text-amber-600">
                <AlertCircle className="w-4 h-4" />
                Unsaved
              </span>
            ) : lastSaved ? (
              <span className="flex items-center gap-1 text-emerald-600">
                <Check className="w-4 h-4" />
                Saved
              </span>
            ) : null}
          </div>
        </div>

        {/* Right side: Action buttons */}
        <div className="flex gap-2">
          {slug && (
            <Link 
              href={`/phones/${slug}?preview=true`} 
              target="_blank" 
              className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <ExternalLink className="w-4 h-4" />
              Preview
            </Link>
          )}
          
          <button 
            onClick={onSaveDraft} 
            disabled={saving} 
            className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            Draft
          </button>
          
          <button 
            onClick={onPublish} 
            disabled={saving} 
            className="flex items-center gap-2 px-3 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            Publish
          </button>
        </div>
      </div>
    </div>
  );
}
