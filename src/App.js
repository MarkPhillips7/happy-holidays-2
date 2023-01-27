import { Container } from "react-bootstrap";
import { Nav, Navbar } from "react-bootstrap";
import "./App.css";
import "./App.scss";
import styles from "./App.module.scss";
import { useLocation } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import Greetings2008 from "./containers/Greetings2008/Greetings2008";
import Greetings2009 from "./containers/Greetings2009/Greetings2009";
import Greetings2011 from "./containers/Greetings2011/Greetings2011";
import Greetings2012 from "./containers/Greetings2012/Greetings2012";
import Greetings2014 from "./containers/Greetings2014/Greetings2014";
import Greetings2015 from "./containers/Greetings2015/Greetings2015";
import Greetings2017 from "./containers/Greetings2017/Greetings2017";
import Greetings2019 from "./containers/Greetings2019/Greetings2019";
import { Greetings2020 } from "./containers/Greetings2020/Greetings2020";
import { Greetings2021 } from "./containers/Greetings2021/Greetings2021";
import { Greetings2022 } from "./containers/Greetings2022/Greetings2022";
import NotFound from "./containers/NotFound/NotFound";

function App(props) {
  const location = useLocation();
  const url = location?.pathname;
  const src = require("./images/red-christmas-ball-icon-44144.png");
  const greetingsYears = [
    "2022",
    "2021",
    "2020",
    "2019",
    "2017",
    "2015",
    "2014",
    "2012",
    "2011",
    "2009",
    "2008",
  ];
  const currentYear = greetingsYears[0];
  const getNavLink = (linkText) => {
    const isActive =
      (linkText === currentYear && url === "/") || url === "/" + linkText;
    return (
      <Nav.Link
        key={linkText}
        className={
          isActive ? "happy-holidays-active" : "happy-holidays-inactive"
        }
        href={linkText}
      >
        {linkText}
      </Nav.Link>
    );
  };
  return (
    <div className={styles.app}>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="/" className={styles.brand}>
            <img
              src={src}
              width="32"
              height="32"
              className="d-inline-block align-top"
              alt="Christmas ornament"
            />
            <span style={{ color: "green" }}>Happy Holidays!</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />

          <Navbar.Collapse id="navbarScroll">
            <Nav className="me-auto">
              {greetingsYears.map((year) => getNavLink(year))}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {/* <div className={styles.appContent}>{props.children}</div> */}
      <Routes>
        <Route index element={<Greetings2022 />} />
        <Route path="2022" element={<Greetings2022 />} />
        <Route path="2021" element={<Greetings2021 />} />
        <Route path="2020" element={<Greetings2020 />} />
        <Route path="2019" element={<Greetings2019 />} />
        <Route path="2017" element={<Greetings2017 />} />
        <Route path="2015" element={<Greetings2015 />} />
        <Route path="2014" element={<Greetings2014 />} />
        <Route path="2012" element={<Greetings2012 />} />
        <Route path="2011" element={<Greetings2011 />} />
        <Route path="2009" element={<Greetings2009 />} />
        <Route path="2008" element={<Greetings2008 />} />
        <Route path="*" element={<NotFound />} status={404} />
      </Routes>
    </div>
  );
}

export default App;
