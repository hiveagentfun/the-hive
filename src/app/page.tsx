import Navbar from "@/components/Navbar";
import SideNav from "@/components/SideNav";
import ScrollProgress from "@/components/ScrollProgress";
import CursorGlow from "@/components/CursorGlow";
import GradientOrbs from "@/components/GradientOrbs";
import Hero from "@/components/Hero";
import Flywheel from "@/components/Flywheel";
import StatsBar from "@/components/StatsBar";
import BeehiveTracker from "@/components/BeehiveTracker";
import DeployedTokens from "@/components/DeployedTokens";
import LiveActivity from "@/components/LiveActivity";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <GradientOrbs />
      <CursorGlow />
      <ScrollProgress />
      <Navbar />
      <SideNav />
      <main>
        <Hero />
        <Flywheel />
        <StatsBar />
        <BeehiveTracker />
        <DeployedTokens />
        <LiveActivity />
      </main>
      <Footer />
    </>
  );
}
