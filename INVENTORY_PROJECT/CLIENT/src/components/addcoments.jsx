
import React, { useState } from 'react'
// import Adminadd from './adminadd'
import { Form } from 'semantic-ui-react'
import { Button, Header, Modal } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import axios from 'axios'
const Addcoments = ({ data, getData }) => {

    var endpoint="http://192.168.1.14:9000/"
    const [open, setOpen] = useState(false)
    const [commentdata, setCommentData] = useState({
        id: "",
        serial: "",
        comments: ""
    })

    function handleCommentChange(event) {
        const { name, value } = event.target;
        setCommentData({ ...commentdata, [name]: value });
    };
    
    const handleCommentClick = () => {
        setOpen(false);
        console.log("comments", commentdata);
        axios.post(endpoint+"comment", commentdata, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => {
            console.log(res.status);
            getData();
        })
        setCommentData('')
    }

    return (
        <Modal
            closeIcon
            size="tiny"
            centered
            open={open}
            trigger={<Button className="ui button" style={{ margin: "10px", float: "right", marginLeft: "-1%" }}>Add Comments</Button>}
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            style={{ maxHeight: "55%",margin:"10%",marginLeft:"30%" }}

        >
            <Header icon='archive' content='Add Comments here' />
            <Modal.Content >
                <Form>
                    <Form.Group widths='equal'>
                        <Form.Input label='Id' placeholder='Enter Id' name="id" value={commentdata.id} onChange={handleCommentChange} />
                        <Form.Input fluid label='Serial No' placeholder='Enter Serial No' name="serial" value={commentdata.serial} onChange={handleCommentChange} />
                    </Form.Group>
                    <Form.TextArea label='Add Comments' placeholder='Add here' name="comments" value={commentdata.comments} onChange={handleCommentChange} />
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button type="button" color="green" onClick={handleCommentClick}>
                    Submit
                </Button>
            </Modal.Actions>
        </Modal>
    )
}

export default Addcoments

