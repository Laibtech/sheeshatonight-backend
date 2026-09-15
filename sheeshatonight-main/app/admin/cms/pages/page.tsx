'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Plus, 
  Edit2, 
  Trash2, 
  ArrowLeft, 
  Search, 
  Globe, 
  Clock, 
  CheckCircle, 
  XCircle,
  Loader2,
  ExternalLink,
  RefreshCw,
  X,
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link2,
  Quote,
  Eye,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Filter
} from 'lucide-react';
import { EmptyState } from '@/components/admin/EmptyState';
import { ConfirmModal } from '@/components/admin/ConfirmModal';
import { TableSkeleton } from '@/components/admin/LoadingSkeleton';
import { useToast } from '@/components/admin/Toast';

interface PageItem {
  id: string;
  title: string;
  slug: string;
  content: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminPagesCmsPage() {
  const { showToast } = useToast();
  const [pages, setPages] = useState<PageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PUBLISHED' | 'DRAFT'>('ALL');
  const [sortBy, setSortBy] = useState<'updatedAt' | 'title'>('updatedAt');

  // Modal / Editor State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<PageItem | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Delete Confirm State
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      const res = await fetch('/api/admin/cms/pages', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setPages(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch CMS pages:', err);
      showToast('Failed to load CMS pages', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingPage(null);
    setTitle('');
    setSlug('');
    setContent('');
    setSeoTitle('');
    setSeoDescription('');
    setIsActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (page: PageItem) => {
    setEditingPage(page);
    setTitle(page.title);
    setSlug(page.slug);
    setContent(page.content);
    setSeoTitle(page.seoTitle || '');
    setSeoDescription(page.seoDescription || '');
    setIsActive(page.isActive);
    setIsModalOpen(true);
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (!editingPage) {
      const generated = newTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setSlug(generated);
    }
  };

  const insertFormat = (prefix: string, suffix: string = '') => {
    const textarea = contentTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end) || 'Sample text';
    const replacement = `${prefix}${selected}${suffix}`;
    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    }, 0);
  };

  const handleSavePage = async (overrideStatus?: boolean) => {
    if (!title.trim()) {
      showToast('Title is required', 'error');
      return;
    }

    const finalStatus = typeof overrideStatus === 'boolean' ? overrideStatus : isActive;

    try {
      setSaving(true);
      const token = localStorage.getItem('auth_token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const payload = {
        title: title.trim(),
        slug: slug.trim(),
        content,
        seoTitle: seoTitle.trim() || null,
        seoDescription: seoDescription.trim() || null,
        isActive: finalStatus,
      };

      if (editingPage) {
        const res = await fetch(`/api/admin/cms/pages/${editingPage.id}`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          showToast(finalStatus ? 'Page published and saved to MySQL!' : 'Page saved as draft!', 'success');
          setIsModalOpen(false);
          fetchPages();
        } else {
          showToast(data.message || 'Failed to update page', 'error');
        }
      } else {
        const res = await fetch('/api/admin/cms/pages', {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          showToast(finalStatus ? 'CMS page created and published!' : 'New CMS page saved as draft!', 'success');
          setIsModalOpen(false);
          fetchPages();
        } else {
          showToast(data.message || 'Failed to create page', 'error');
        }
      }
    } catch (err) {
      showToast('Failed to save CMS page', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (page: PageItem) => {
    try {
      setTogglingId(page.id);
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`/api/admin/cms/pages/${page.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ isActive: !page.isActive }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Page is now ${!page.isActive ? 'Published (Live)' : 'Draft'}!`, 'success');
        setPages((prev) => prev.map((p) => (p.id === page.id ? { ...p, isActive: !p.isActive } : p)));
      } else {
        showToast(data.message || 'Failed to toggle status', 'error');
      }
    } catch {
      showToast('Failed to change status', 'error');
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`/api/admin/cms/pages/${deletingId}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (data.success) {
        showToast('CMS page deleted successfully', 'success');
        setDeleteConfirmOpen(false);
        setDeletingId(null);
        fetchPages();
      } else {
        showToast(data.message || 'Failed to delete page', 'error');
      }
    } catch (err) {
      showToast('Failed to delete page', 'error');
    }
  };

  const getPageUrl = (pageSlug: string) => {
    const rootPages = ['about', 'contact', 'faqs', 'privacy', 'terms', 'refund-policy', 'shipping-policy', 'vendor-terms'];
    return rootPages.includes(pageSlug) ? `/${pageSlug}` : `/pages/${pageSlug}`;
  };

  // Filter & Sort
  const filteredPages = pages.filter((p) => {
    const q = search.toLowerCase().trim();
    const matchesSearch = !q || p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q);
    const matchesStatus = 
      statusFilter === 'ALL' 
        ? true 
        : statusFilter === 'PUBLISHED' 
          ? p.isActive 
          : !p.isActive;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    return new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime();
  });

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <Link href="/admin/cms" className="hover:text-purple-600 transition">CMS Overview</Link>
            <span>/</span>
            <span className="text-slate-800 font-semibold">Static Content Pages</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <FileText className="w-7 h-7 text-[#74189B]" />
            Static Pages CMS Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your frontend content, legal policies, and informational pages stored directly in MySQL.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchPages}
            disabled={loading}
            className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#74189B] text-white rounded-xl font-semibold text-sm hover:bg-[#571275] transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Create CMS Page
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search pages by title, URL slug, or content keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#74189B]/20 focus:border-[#74189B]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Status Filter Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg transition ${statusFilter === 'ALL' ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'}`}
            >
              All ({pages.length})
            </button>
            <button
              onClick={() => setStatusFilter('PUBLISHED')}
              className={`px-3 py-1.5 rounded-lg transition ${statusFilter === 'PUBLISHED' ? 'bg-white text-emerald-700 shadow-sm' : 'hover:text-slate-900'}`}
            >
              Published ({pages.filter(p => p.isActive).length})
            </button>
            <button
              onClick={() => setStatusFilter('DRAFT')}
              className={`px-3 py-1.5 rounded-lg transition ${statusFilter === 'DRAFT' ? 'bg-white text-amber-700 shadow-sm' : 'hover:text-slate-900'}`}
            >
              Drafts ({pages.filter(p => !p.isActive).length})
            </button>
          </div>

          {/* Sort Selector */}
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#74189B]"
          >
            <option value="updatedAt">Sort: Recently Updated</option>
            <option value="title">Sort: Title (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Pages Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6">
            <TableSkeleton rows={6} cols={5} />
          </div>
        ) : filteredPages.length === 0 ? (
          <div className="py-12">
            <EmptyState
              title="No CMS Pages Found"
              description={search ? 'No pages matching your search criteria.' : 'Create your first static CMS page to get started.'}
              actionLabel={search ? 'Clear Filters' : 'Create Page'}
              onAction={search ? () => { setSearch(''); setStatusFilter('ALL'); } : handleOpenCreate}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Page Title & Slug</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">SEO Metadata</th>
                  <th className="px-6 py-4">Last Modified</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPages.map((page) => {
                  const frontendUrl = getPageUrl(page.slug);

                  return (
                    <tr key={page.id} className="hover:bg-slate-50/60 transition group">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900 group-hover:text-[#74189B] transition flex items-center gap-2">
                          <FileText className="w-4 h-4 text-slate-400" />
                          <span>{page.title}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                            {page.slug}
                          </span>
                          <span className="text-xs text-slate-400">({frontendUrl})</span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleStatus(page)}
                          disabled={togglingId === page.id}
                          className="inline-flex items-center gap-1.5 focus:outline-none"
                          title="Click to toggle publish status"
                        >
                          {page.isActive ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition cursor-pointer">
                              <CheckCircle className="w-3.5 h-3.5" /> Published
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition cursor-pointer">
                              <Clock className="w-3.5 h-3.5" /> Draft
                            </span>
                          )}
                        </button>
                      </td>

                      <td className="px-6 py-4">
                        <div className="max-w-xs truncate text-xs text-slate-700 font-medium">
                          {page.seoTitle || page.title}
                        </div>
                        <div className="max-w-xs truncate text-[11px] text-slate-400 mt-0.5">
                          {page.seoDescription || (page.content ? page.content.substring(0, 75) + '...' : 'No description set')}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-xs text-slate-500 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{new Date(page.updatedAt || page.createdAt).toLocaleDateString('en-AE', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`${frontendUrl}?preview=true`}
                            target="_blank"
                            className="p-2 text-slate-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition flex items-center gap-1 text-xs font-semibold"
                            title="Preview page with actual live frontend layout"
                          >
                            <Eye className="w-4 h-4" />
                            <span className="hidden sm:inline">Preview</span>
                          </Link>

                          <button
                            onClick={() => handleOpenEdit(page)}
                            className="p-2 text-slate-600 hover:text-[#74189B] hover:bg-[#F8F2FA] rounded-xl transition flex items-center gap-1 text-xs font-semibold"
                            title="Edit page content and SEO"
                          >
                            <Edit2 className="w-4 h-4" />
                            <span className="hidden sm:inline">Edit</span>
                          </button>

                          <button
                            onClick={() => {
                              setDeletingId(page.id);
                              setDeleteConfirmOpen(true);
                            }}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                            title="Delete page"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl border border-slate-100 max-h-[92vh] flex flex-col my-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F8F2FA] text-[#74189B] flex items-center justify-center font-bold">
                  <FileText size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {editingPage ? `Edit: ${editingPage.title}` : 'Create New CMS Page'}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Live database updates take effect instantly across all frontend routes.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Basic Fields */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Page Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. VIP Yacht Experiences"
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#74189B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    URL Slug * (Unique Route)
                  </label>
                  <div className="flex items-center">
                    <span className="bg-slate-100 border border-r-0 border-slate-200 px-3 py-2.5 rounded-l-xl text-xs text-slate-500 font-mono">
                      /
                    </span>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, ''))}
                      placeholder="e.g. vip-yacht-experiences"
                      required
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-r-xl text-sm font-mono focus:outline-none focus:border-[#74189B]"
                    />
                  </div>
                </div>
              </div>

              {/* Status Selector */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-slate-800">Publication Visibility</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {isActive 
                      ? 'Live on the website for all customers and search engines.' 
                      : 'Saved as draft. Only visible via admin preview.'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsActive(false)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${!isActive ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}
                  >
                    Draft Mode
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsActive(true)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${isActive ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}
                  >
                    Published Live
                  </button>
                </div>
              </div>

              {/* Rich Content Editor */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Page Content (Markdown & Rich Text Supported)
                  </label>
                  <span className="text-xs text-slate-400 font-mono">
                    {content.length} characters
                  </span>
                </div>

                {/* Formatting Toolbar */}
                <div className="bg-slate-100 border border-b-0 border-slate-200 p-2 rounded-t-2xl flex flex-wrap items-center gap-1">
                  <button
                    type="button"
                    onClick={() => insertFormat('**', '**')}
                    className="p-1.5 text-slate-700 hover:bg-white rounded-lg transition"
                    title="Bold (**text**)"
                  >
                    <Bold size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormat('*', '*')}
                    className="p-1.5 text-slate-700 hover:bg-white rounded-lg transition"
                    title="Italic (*text*)"
                  >
                    <Italic size={16} />
                  </button>
                  <span className="w-px h-4 bg-slate-300 mx-1" />
                  <button
                    type="button"
                    onClick={() => insertFormat('## ')}
                    className="p-1.5 text-slate-700 hover:bg-white rounded-lg transition"
                    title="Heading 2 (## Title)"
                  >
                    <Heading2 size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormat('### ')}
                    className="p-1.5 text-slate-700 hover:bg-white rounded-lg transition"
                    title="Heading 3 (### Subtitle)"
                  >
                    <Heading3 size={16} />
                  </button>
                  <span className="w-px h-4 bg-slate-300 mx-1" />
                  <button
                    type="button"
                    onClick={() => insertFormat('- ')}
                    className="p-1.5 text-slate-700 hover:bg-white rounded-lg transition"
                    title="Bullet List (- item)"
                  >
                    <List size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormat('1. ')}
                    className="p-1.5 text-slate-700 hover:bg-white rounded-lg transition"
                    title="Numbered List (1. item)"
                  >
                    <ListOrdered size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormat('[Link Title](', ')')}
                    className="p-1.5 text-slate-700 hover:bg-white rounded-lg transition"
                    title="Link [title](url)"
                  >
                    <Link2 size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormat('> ')}
                    className="p-1.5 text-slate-700 hover:bg-white rounded-lg transition"
                    title="Quote Block (> quote)"
                  >
                    <Quote size={16} />
                  </button>
                </div>

                <textarea
                  ref={contentTextareaRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter the body content for this page..."
                  rows={10}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-b-2xl text-sm font-sans focus:outline-none focus:border-[#74189B] leading-relaxed"
                />
              </div>

              {/* SEO Metadata Section */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                  <Globe size={16} className="text-[#74189B]" /> Search Engine Optimization (SEO)
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Meta Title (Google Browser Tab Title)
                  </label>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    placeholder="e.g. Terms of Service | SheeshaTonight UAE"
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#74189B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Meta Description (Google Snippet)
                  </label>
                  <textarea
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    placeholder="Brief description summarizing this page for search results..."
                    rows={2}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#74189B]"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50 rounded-b-3xl">
              <div>
                {editingPage && (
                  <Link
                    href={`${getPageUrl(editingPage.slug)}?preview=true`}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-100 transition shadow-sm"
                  >
                    <Eye size={16} /> Preview on Web
                  </Link>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 text-sm font-semibold transition"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => handleSavePage(false)}
                  disabled={saving}
                  className="px-4 py-2 bg-amber-50 border border-amber-200 text-amber-800 text-sm font-semibold rounded-xl hover:bg-amber-100 transition disabled:opacity-50"
                >
                  Save Draft
                </button>

                <button
                  type="button"
                  onClick={() => handleSavePage(true)}
                  disabled={saving}
                  className="px-5 py-2 bg-[#74189B] text-white text-sm font-bold rounded-xl hover:bg-[#571275] transition shadow-md flex items-center gap-2 disabled:opacity-50"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{editingPage ? 'Save & Publish' : 'Create & Publish'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      <ConfirmModal
        isOpen={deleteConfirmOpen}
        title="Delete CMS Page"
        message="Are you sure you want to delete this static page? Any frontend links pointing to this slug will return a 404 error."
        confirmText="Yes, Delete Page"
        onConfirm={handleDelete}
        onCancel={() => {
          setDeleteConfirmOpen(false);
          setDeletingId(null);
        }}
      />
    </div>
  );
}
