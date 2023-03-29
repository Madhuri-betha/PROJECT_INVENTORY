
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Button, Header, Modal, Form } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'

const Addcomments = ({ data, getData }) => {

    const [idOptions, setIdOptions] = useState([])
    const [serialOptions, setSerialOptions] = useState([])
    const [id, setId] = useState("")
    const [serial, setSerial] = useState("")
    const [comments, setComments] = useState("")

    let idobject = { key: "", text: "", value: "" }
    let serialobject = { key: "", text: "", value: "" }
    let idarr = [];
    let serialarr = []

    useEffect(() => {
        data.forEach(element => {
            idobject.key = element.id;
            idobject.text = element.id;
            idobject.value = element.id;
            serialobject.key = element.serial;
            serialobject.text = element.serial;
            serialobject.value = element.serial;
            idarr.push({ ...idobject });
            serialarr.push({ ...serialobject });
        })
        idarr.push({ key: "", text: "other", value: "" })
        serialarr.push({ key: "", text: "other", value: "" })
        setIdOptions(idarr);
        setSerialOptions(serialarr);
    }, [data])
    var endpoint = "http://192.168.1.14:9000/"
    const [open, setOpen] = useState(false)
    var [commentdata, setCommentData] = useState({
        id: "",
        serial: "",
        comments: ""
    })


    const handleCommentClick = () => {
        commentdata = { id, serial, comments }
        setOpen(false);
        if ((commentdata.id != "" || commentdata.serial != "") && commentdata.comments != "") {
            axios.post(endpoint + "comment", commentdata, {
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(res => {
                console.log(res.status);
                getData();
            })
        }
        setId('');
        setSerial('')
        setComments('')
    }

    return (
        <Modal
            closeIcon
            size="tiny"
            centered
            open={open}
            trigger={<Button className="ui button" style={{ margin: "10px", float: "right", marginLeft: "-1%" }}>Add Comments</Button>}
            onClose={() => {
                setOpen(false); setId('');
                setSerial('')
                setComments('')
            }}
            onOpen={() => setOpen(true)}
            style={{ maxHeight: "60%", margin: "10vh", marginLeft: "15vh" }}

        >
            <Header icon='archive' content='Add Comments either by Id or serial' />
            <Modal.Content >
                <Form>
                    <Form.Group widths='equal'>
                        <Form.Dropdown search selection label='Id' placeholder='Enter Id' name="id" value={id} onChange={(e, data) => { setId(data.value); }} options={idOptions} />
                        <Form.Dropdown search selection label='Serial No' placeholder='Enter Serial No' name="serial" value={serial} onChange={(e, data) => { setSerial(data.value); }} options={serialOptions} />
                    </Form.Group>
                    <Form.TextArea label='Add Comments' placeholder='Add here' name="comments" value={comments} onChange={(e, data) => { setComments(data.value); }} />
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button type="button" color="green" onClick={handleCommentClick}>Submit</Button>
            </Modal.Actions>
        </Modal>
    )
}

export default Addcomments;

