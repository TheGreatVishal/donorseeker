// import HomePageNavbar from "@/components/HomePageNavbar";
import { Navbar } from "@/components/Navbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
       <Navbar />
      <main className="flex-grow">{children}</main>
    </div>
  );
};

export default Layout;
