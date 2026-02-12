import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MobileBottomNav from '@/components/MobileBottomNav'
import FloatingConsult from '@/components/FloatingConsult'
import PopupModal from '@/components/PopupModal'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="boas-main">{children}</main>
      <Footer />
      <PopupModal />
      <MobileBottomNav />
      <FloatingConsult />
    </>
  )
}
