import React from "react";
import { useContext } from "react";
import { Context } from "../../index";
import { Navigate } from "react-router-dom";
import Hero from "./Hero";
import HowItWorks from "./HowItWorks";
import PopularCategory from "./PopularCategory";
import PopularCompany from "./PopularCompany";

const Home = () => {
  const { isAuthorized } = useContext(Context);
  if (!isAuthorized) {
    return <Navigate to={"/login"} />;
  }
  return (
    <>
      <section className="homePage page">
        <Hero />
        <HowItWorks />
        <PopularCategory />
        <PopularCompany />
      </section>
    </>
  );
};

export default Home;