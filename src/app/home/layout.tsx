// import HomePageNavbar from "@/components/HomePageNavbar";
import { HomePageNavbar } from "@/components/HomePageNavbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
    
       <HomePageNavbar />
      <main className="flex-grow p-6">{children}</main>
    </div>
  );
};

export default Layout;
