// import { HomePageNavbar } from "@/components/HomePageNavbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mt-12 pt-5">
      <main>{children}</main>
    </div>
  );
};

export default Layout;
