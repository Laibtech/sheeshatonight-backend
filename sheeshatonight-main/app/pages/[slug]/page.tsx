import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { FileText, Calendar, ArrowLeft, ShieldAlert, Sparkles } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }> | { slug: string };
  searchParams?: Promise<{ preview?: string }> | { preview?: string };
}

export default async function DynamicCmsPage(props: PageProps) {
  const params = await props.params;
  const searchParams = props.searchParams ? await props.searchParams : {};
  const slug = params?.slug;
  const isPreview = searchParams?.preview === 'true';

  let page = null;
  if (slug) {
    page = await prisma.cmsPage.findUnique({
      where: { slug },
    }).catch(() => null);
  }

  // If not in preview mode, do not show inactive pages to public
  const isVisible = page && (page.isActive || isPreview);

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-between">
      <Header />

      {/* Preview mode alert banner */}
      {isPreview && page && !page.isActive && (
        <div className="bg-amber-500 text-white px-4 py-2.5 text-center text-sm font-semibold flex items-center justify-center gap-2 shadow-md">
          <ShieldAlert size={18} />
          <span>ADMIN PREVIEW MODE — This page is currently saved as a DRAFT and is not visible to the public.</span>
        </div>
      )}

      <main className="flex-1 max-w-[1000px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!isVisible || !page ? (
          <div className="py-20 text-center bg-white rounded-3xl p-10 border border-slate-200 shadow-sm max-w-lg mx-auto">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText size={32} />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Page Not Found</h1>
            <p className="text-slate-500 mb-6 text-sm">The page you are looking for does not exist or has not been published yet.</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#74189B] text-white rounded-xl text-sm font-semibold hover:bg-[#571275] transition shadow-md"
            >
              <ArrowLeft size={16} /> Return to Home
            </Link>
          </div>
        ) : (
          <article className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)]">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-6">
              <Link href="/" className="hover:text-[#74189B]">Home</Link>
              <span>/</span>
              <span>Pages</span>
              <span>/</span>
              <span className="text-[#74189B]">{page.title}</span>
            </div>

            {/* Title Header */}
            <header className="border-b border-slate-100 pb-8 mb-8">
              <div className="flex items-center gap-2 text-[#F1A51D] text-xs font-bold uppercase tracking-widest mb-2">
                <Sparkles size={14} /> SheeshaTonight Official Information
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
                {page.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} /> Last updated {new Date(page.updatedAt || page.createdAt).toLocaleDateString('en-AE', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
                <span>•</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700">
                  {page.isActive ? 'Published' : 'Draft'}
                </span>
              </div>
            </header>

            {/* Page Content */}
            <div
              className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-600 prose-p:leading-relaxed prose-li:text-slate-600 prose-strong:text-slate-900 whitespace-pre-wrap leading-relaxed text-[15px]"
            >
              {page.content}
            </div>
          </article>
        )}
      </main>

      <Footer />
    </div>
  );
}
