import { createBrowserRouter } from "react-router-dom";
import Home from "./components/Home";
import Symptomgalaxy from "./components/Symptomgalaxy";
import DIYData from "./components/DIYData";
import Colony from "./components/Colony";
import Cluster from "./components/Cluster";
import Experiences from "./components/Experiences";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/symptomgalaxy",
    element: <Symptomgalaxy />
  },
  {
    path: "/diydata",
    element: <DIYData />
  },
  {
    path: "/colony",
    element: <Colony />
  },
  {
    path: "/cluster",
    element: <Cluster />
  },
  {
    path: "/experiences",
    element: <Experiences />
  }
]);

export default router;
