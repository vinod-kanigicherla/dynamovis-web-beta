import DefaultFileLoader from "../../components/DefaultFileLoader/DefaultFileLoader";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import FileLoader from "../../components/FileLoader/FileLoader";
import styles from "./Landing.module.css";
import dstyles from "../../design/css/style.css";
import animate from "../../design/css/animate.css";
import dfont from "../../design/css/font-awesome.min.css";
import namari from "../../design/css/namari-color.css";
import Video from "../../assets/videos/Albatross_WindSupport_MoveSpeed.mp4";

import Draggable from "react-draggable";
import { Resizable } from "react-resizable";
import styled from "styled-components";
import Header from "./Header"; // Add this import statement
import IdSelect from "../FileLoader/IdSelect";

const WindowWrapper = styled.div`
  position: absolute;
  border: 1px solid #ccc;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  overflow: hidden;
`;

const WindowContent = styled.div`
  padding: 8px;
`;

const Landing = (props) => {
  const Space = () => {
    return <div className={styles.space} />;
  };

  return (
    <div>
      <div id="wrapper">
        <div id={styles.Landing}>
          <Header /> {/* Add the Header component */}
          <div id="banner" class="mb-50">
            <Container>
              <Row>
                <Col>
                  <div class="section-heading">
                    <h1> Welcome to DynamoVIS v0.2</h1>
                    <h2>
                      An interactive tool that allows for the exploratory
                      visualization of animal movement data. Biologists and
                      movement ecologists can create intuitive, interactive, and
                      high quality animations in order to visualize and
                      investigate their data. With DYNAMOvis, preliminary and
                      exploratory analysis can easily be accomplished and help
                      identify environmental drivers of movement.
                    </h2>
                  </div>
                    <FileLoader
                      setIdTagName={props.setIdTagName}
                      setIdTimeRanges={props.setIdTimeRanges}
                      setIds={props.setIds}
                      setColors={props.setColors}
                      setShowIds={props.setShowIds}
                      dataset={props.dataset}
                      setDisplayingIds={props.setDisplayingIds}
                      setTagsMatrix={props.setTagsMatrix}
                      setTagForLineColor={props.setTagForLineColor}
                      tagForLineColorIndex={props.tagForLineColorIndex}
                      localCenters={props.localCenters}
                      setLocalCenters={props.setLocalCenters}
                      setZoom={props.setZoom}
                      setCenter={props.setCenter}
                      setData={props.setData}
                      setLatTag={props.setLatTag}
                      setLongTag={props.setLongTag}
                      setPolylines={props.setPolylines}
                      setInitialTime={props.setInitialTime}
                      setEndingTime={props.setEndingTime}
                    />
                </Col>
                <Col>
                  <div className={styles.videoContainer}>
                    <video width="100%" className={styles.video} autoPlay muted>
                      <source src={Video} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    <Space />
                    <DefaultFileLoader
                      setIdTagName={props.setIdTagName}
                      setIds={props.setIds}
                      setColors={props.setColors}
                      setShowIds={props.setShowIds}
                      dataset={props.dataset}
                      setDisplayingIds={props.setDisplayingIds}
                      setTagsMatrix={props.setTagsMatrix}
                      setTagForLineColor={props.setTagForLineColor}
                      tagForLineColorIndex={props.tagForLineColorIndex}
                      setZoom={props.setZoom}
                      setCenter={props.setCenter}
                      localCenters={props.localCenters}
                      setLocalCenters={props.setLocalCenters}
                      setData={props.setData}
                      setLatTag={props.setLatTag}
                      setLongTag={props.setLongTag}
                      setPolylines={props.setPolylines}
                      setInitialTime={props.setInitialTime}
                      setEndingTime={props.setEndingTime}
                      setIdTimeRanges={props.setIdTimeRanges}
                    />
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
        </div>
      </div>
      {/* Include JavaScript resources */}
      <script src="design/js/jquery.1.8.3.min.js"></script>
      <script src="design/js/wow.min.js"></script>
      <script src="design/js/featherlight.min.js"></script>
      <script src="design/js/featherlight.gallery.min.js"></script>
      <script src="design/js/jquery.enllax.min.js"></script>
      <script src="design/js/jquery.scrollUp.min.js"></script>
      <script src="design/js/jquery.easing.min.js"></script>
      <script src="design/js/jquery.stickyNavbar.min.js"></script>
      <script src="design/js/jquery.waypoints.min.js"></script>
      <script src="design/js/images-loaded.min.js"></script>
      <script src="design/js/lightbox.min.js"></script>
      <script src="design/js/site.js"></script>
    </div>
  );
};

export default Landing;
