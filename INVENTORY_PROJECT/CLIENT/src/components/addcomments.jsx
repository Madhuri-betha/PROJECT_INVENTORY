
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Button, Header, Modal, Form } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'

const Addcomments = ({ data, getData }) => {

    var endpoint = "http://192.168.1.36:9000/"
    const [idOptions, setIdOptions] = useState([])
    const [serialOptions, setSerialOptions] = useState([])
    const [open, setOpen] = useState(false)
    const [commentdata, setCommentData] = useState({
        id: "",
        serial: "",
        comments: ""
    })


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
    
    

   function handleChange(event,data)
   {
    setCommentData({...commentdata,[data.name]:data.value})
   }

  
 
    const handleCommentClick = () => {
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
        setCommentData({})
    }

    return (
        <Modal
            closeIcon
            size="tiny"
            centered
            open={open}
            trigger={<Button className="ui button" style={{margin: "10px", float: "right", marginLeft: "-1%" }}>Add Comments</Button>}
            onClose={() => {
                setOpen(false);
                setCommentData({})
            }}
            onOpen={() => setOpen(true)}
            style={{ maxHeight: "60%", margin: "10vh", marginLeft: "15vh" }}

        >
            <Header icon='archive' content='Add Comments either by Id or serial' />
            <Modal.Content >
                <Form>
                    <Form.Group widths='equal'>
                        <Form.Dropdown search selection label='Id' placeholder='Enter Id' name="id" value={commentdata.id} onChange={handleChange} options={idOptions} />
                        <Form.Dropdown search selection label='Serial No' placeholder='Enter Serial No' name="serial" value={commentdata.serial} onChange={handleChange}  options={serialOptions} />
                    </Form.Group>
                    <Form.TextArea label='Add Comments' placeholder='Add here' name="comments" value={commentdata.comments} onChange={handleChange} />
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button type="button" color="green" onClick={handleCommentClick}>Submit</Button>
            </Modal.Actions>
        </Modal>
    )
}

export default Addcomments;

