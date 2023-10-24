import { Fragment } from "react";
import Header from "../header";
import Footer from "../footer";
import { Outlet } from "react-router-dom";

const FrontLayout = () => {
  return (
    <Fragment>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </Fragment>
  );
};

export default FrontLayout;
