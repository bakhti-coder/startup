import { Parallax } from "react-parallax";
import "./style.scss";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <section className="home">
      <Parallax
        className="paralax"
        bgImage="/images/bgimg.png"
        bgImageStyle={{ objectFit: "cover" }}
        strength={300}
      >
        <div className="home__text">
          <h1 className="home__title">Portfolios site</h1>
          <p className="home__subtitle">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nostrum
            neque tempore iste voluptatem, distinctio sit animi est,
            reprehenderit quaerat repellat iure fuga error repudiandae quia
            ipsum ipsam illum aspernatur praesentium quas soluta aperiam quidem
            minima atque. Iste sed, ullam ab quam, nihil ad sunt reiciendis
            repellat, dolores quod dolorem magni?
          </p>
          <Link to='/messagess'>
            <button className="home__button">Contact us</button>
          </Link>
        </div>
      </Parallax>
    </section>
  );
};

export default HomePage;
