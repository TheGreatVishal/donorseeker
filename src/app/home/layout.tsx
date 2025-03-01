import { HomePageNavbar } from "@/components/HomePageNavbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
       <HomePageNavbar />
      <main className="flex-grow pt-10">{children}</main>
    </div>
  );
};

export default Layout;
