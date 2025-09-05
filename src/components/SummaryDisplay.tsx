'use client';

import React, { useState } from 'react';
import { FaCopy, FaEdit, FaSave, FaUndo, FaExpand, FaCompress } from 'react-icons/fa';

interface SummaryDisplayProps {
  summaries: {
    brief: string;
    detailed: string;
    keyPoints: string;
  };
}

const SummaryDisplay: React.FC<SummaryDisplayProps> = ({ summaries }) => {
  const [activeTab, setActiveTab] = useState<'brief' | 'detailed' | 'keyPoints'>('brief');
  const [editMode, setEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [originalContent, setOriginalContent] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const tabs = [
    { key: 'brief', label: 'Ringkasan Singkat', icon: '📝', content: summaries.brief },
    { key: 'detailed', label: 'Ringkasan Detail', icon: '📖', content: summaries.detailed },
    { key: 'keyPoints', label: 'Poin Penting', icon: '🎯', content: summaries.keyPoints }
  ];

  const getCurrentContent = () => {
    if (editMode) return editedContent;
    return tabs.find(tab => tab.key === activeTab)?.content || '';
  };

  const handleEdit = () => {
    const currentContent = tabs.find(tab => tab.key === activeTab)?.content || '';
    setOriginalContent(currentContent);
    setEditedContent(currentContent);
    setEditMode(true);
  };

  const handleSave = () => {
    // Update the summary content (you might want to save this to state management or backend)
    const tabIndex = tabs.findIndex(tab => tab.key === activeTab);
    if (tabIndex !== -1) {
      tabs[tabIndex].content = editedContent;
    }
    setEditMode(false);
  };

  const handleCancel = () => {
    setEditedContent(originalContent);
    setEditMode(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getCurrentContent());
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="relative">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 via-purple-50/30 to-indigo-50/50 rounded-3xl blur-3xl"></div>
      
      <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">🤖</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">AI Summary</h2>
                <p className="text-violet-100 text-sm">Powered by Google Gemini 1.5 Flash</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-200 text-white"
                title={isExpanded ? "Collapse" : "Expand"}
              >
                {isExpanded ? <FaCompress /> : <FaExpand />}
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-8 pt-6">
          <div className="flex gap-2 bg-gray-100/50 rounded-2xl p-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key as any);
                  setEditMode(false);
                }}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === tab.key
                    ? 'bg-white shadow-lg text-violet-600 transform scale-[1.02]'
                    : 'text-gray-600 hover:text-violet-600 hover:bg-white/50'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="text-sm font-semibold">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-6">
          <div className="relative">
            {/* Action Buttons */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-2">
                {!editMode ? (
                  <>
                    <button
                      onClick={handleEdit}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <FaEdit className="w-3 h-3" />
                      Edit
                    </button>
                    <button
                      onClick={handleCopy}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                        copySuccess
                          ? 'bg-green-500 text-white'
                          : 'bg-violet-500 hover:bg-violet-600 text-white'
                      }`}
                    >
                      <FaCopy className="w-3 h-3" />
                      {copySuccess ? 'Copied!' : 'Copy'}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <FaSave className="w-3 h-3" />
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <FaUndo className="w-3 h-3" />
                      Cancel
                    </button>
                  </>
                )}
              </div>
              
              <div className="text-sm text-gray-500">
                {getCurrentContent().length} characters
              </div>
            </div>

            {/* Content Display */}
            <div className={`transition-all duration-500 ${isExpanded ? 'max-h-none' : 'max-h-96 overflow-hidden'}`}>
              {editMode ? (
                <div className="relative">
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="w-full h-64 p-6 border-2 border-violet-200 rounded-2xl focus:border-violet-400 focus:outline-none resize-none bg-gradient-to-br from-white to-violet-50/30 text-gray-800 leading-relaxed shadow-inner"
                    placeholder="Edit your summary here..."
                  />
                  <div className="absolute bottom-4 right-4 text-xs text-gray-400">
                    Click Save to keep changes
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-white to-violet-50/30 rounded-2xl p-6 shadow-inner border border-violet-100/50">
                  <div className="prose prose-violet max-w-none">
                    <div className="text-gray-800 leading-relaxed whitespace-pre-line text-base">
                      {getCurrentContent()}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {!isExpanded && getCurrentContent().length > 500 && (
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-gray-50/50 border-t border-gray-200/50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>AI Generated Summary</span>
            </div>
            <div className="text-xs">
              Generated at {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryDisplay;
