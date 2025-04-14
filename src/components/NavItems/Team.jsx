import Container from "react-bootstrap/esm/Container";
import Header from "../Landing/Header";
import styles from "./Team.module.css";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Card from "react-bootstrap/esm/Card";
import img1 from "../../assets/team_images/Cailean.jpg"; 
import img2 from "../../assets/team_images/Vinny.jpg"; 
import img3 from "../../assets/team_images/Neil.jpg"; 

const Team = (props) => {
    return (
        <div>
          <div id="wrapper">
            <div id={styles.Landing}>
                <Header/>
                <div id= "banner" class="mb-50"> 
                    <Container>
                      <Row>
                        <Col>
                          <Card style={{ width: '15rem' }}>
                            <Card.Img variant = "top" src={img1} title="Image"/>
                            <Card.Body>
                                <Card.Title>Cailean Fernandes</Card.Title>  
                                <Card.Text>UI/UX & Software Developer</Card.Text>
                              
                            </Card.Body> 
                          </Card>
                        </Col>
                        <Col>
                        <Card style={{ width: '15rem' }}>
                            <Card.Img variant = "top" src={img2}/>
                            <Card.Body>
                                <Card.Title>Vinny Kanigercherla</Card.Title>  
                                <Card.Text>Software Developer</Card.Text>
                              
                            </Card.Body> 
                          </Card>
                        </Col>
                        <Col>
                        <Card style={{ width: '15rem' }}>
                            <Card.Img variant = "top" src={img3}/>
                            <Card.Body>
                                <Card.Title>Neil Antony</Card.Title>  
                                <Card.Text>Software Developer</Card.Text>
                              
                            </Card.Body> 
                          </Card>
                        </Col>  
                      </Row>
                    </Container>
                </div>
            </div>
          </div>
        </div>
    )
}


export default Team;