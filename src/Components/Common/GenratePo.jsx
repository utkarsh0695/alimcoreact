import { CardHeader } from "react-bootstrap"
import { Card, Container } from "reactstrap"


const InvoiceSlip = ()=>{

    return (
        <>
        <Container fluid={true}>
            <Card>
                <CardHeader style={{ textAlign: 'center' }}>
                    <h1>Artificial Limbs Manufacturing Corporation of India</h1>
                    <p>(A Goverment of India undertaking)</p>
                    <p>AN ISO 9001:2015 Company</p>
                    <p>Kanpur</p>
                </CardHeader>
            </Card>
        </Container>
        </>
    )
}

export default InvoiceSlip

