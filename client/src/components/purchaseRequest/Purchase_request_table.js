import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Table, Button, Container, Form } from 'react-bootstrap';
import moment from 'moment';
import { API_URL } from '../../utils/constant';

const RequestTable = () => {
  const arr = ['Request ID', 'Department', 'Date Requested', 'Item Name', 'Quotation']
  const [allrequest, setrequests] = useState([])
  const interval_id = useRef(null);
  // const [open, setOpen] = useState(false);
  async function fetch() {
    console.log('in fetch');
    await axios.get(`${API_URL}/get_purchase_request`, {
      withCredentials: true
    }).then((res) => {
      console.log(res.data);

      setrequests(res.data);

    })
  }
  // var requests = []
  useEffect(() => {
    fetch()

    interval_id.current = setInterval(() => { fetch() }, 3000);
    return function cleanup() {
      clearInterval(interval_id.current);
    }
  }, [])

  // const [showModal, setShow] = useState(false)
  const [file, SetFile] = useState(null)
  const [Info, SetInfo] = useState("")


  const SubmitFile = async (e) => {

    e.preventDefault();

    console.log('File ', file)
    // console.log(e.target.file)


    // console.log('document', document.getElementById('file').value())

    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      await axios.post(`${API_URL}/${Info}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then((res) => {
        if (res.data.code === 200) {
          SetFile(null);
          window.flash('File Successfully Submitted')
          fetch();
        }
        else {
          window.flash('Failed To Submit The File', 'danger')
        }
      });
    } else {
      window.flash('Please select a file to add.', 'danger');
    }






  }

  const onChangeHandlerFile = (files) => {
    console.log(files)
    const [uploadedFile] = files.target.files;
    console.log(uploadedFile)
    SetFile(uploadedFile)

  }



  // const ModalContent = ()=>{

  //    function getBase64(e) {
  //         var file = e.target.files[0]
  //         let reader = new FileReader()
  //         reader.readAsDataURL(file)
  //         reader.onload = () => {
  //             console.log(reader.result)
  //             SetFile(reader.result)
  //         //   this.setState({
  //         //     imgUpload: reader.result
  //         //   })
  //         };
  //         reader.onerror = function (error) {
  //           console.log('Error: ', error);
  //         }
  //       }


  //     return(
  //         <Modal show = {showModal} onHide ={() => {setShow(false)}}>
  //             <Modal.Header closeButton>
  //                 <Modal.Title>
  //                     Details
  //                 </Modal.Title>
  //                 </Modal.Header>
  //                 <Form>

  //                 <ModalBody>

  //                 <input
  //                 type = 'file'
  //                 id="file"
  //                 name = "file"
  //                 value={FileInfo}
  //                 onChange={(e) => { e.preventDefault();
  //                     SetFile(e.target.files[0])
  //                     // getBase64(e);
  //                 }}
  //                 />
  //                 </ModalBody>


  //             <Modal.Footer>
  //                 <Btn className = "btn-success" type = "submit">Submit</Btn>
  //             </Modal.Footer>
  //             </Form>

  //         </Modal>
  //     );


  // }



  return (
    <>
      {/* {showModal?
            <div>
                <ModalContent/>
            </div>
        :null    */}




      <Container>
        <Button className="Btn float-right mb-2" onClick={fetch} >Refresh</Button>
        <Table className="TableStyle" responsive="sm">
          <thead>
            <tr>
              <th>#</th>
              {arr.map((_, index) => (
                <th key={index}>{_}</th>
              ))}

            </tr>
          </thead>
          <tbody>
            {allrequest.map((request, index) => {
              return (
                <>
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{request.Order_ID}<br /></td>
                    {/* <td>{request.R_Emp_Name}<br /></td>
                    <td>{request.R_Emp_Email}</td> */}
                    <td>{request.R_Emp_Dept.Dept_Name}</td>
                    <td>{moment(request.Added).format('Do MMMM YYYY')}</td>
                    <td className="new-line">{request.Item}</td>
                    {/* <td>{request.Quantity}</td> */}
                    {/* <td>{request.Duration}</td> */}
                    <td>


                      {/* <a href = "http://localhost:5000/upload"><Btn>Upload</Btn></a> */}

                      <Form onSubmit={SubmitFile}>
                        <Form.File name="file" onChange={onChangeHandlerFile} />
                        <Button type="submit" className="Btn mt-2 btn btn-md" onClick={() => { SetInfo(request._id) }}>Submit</Button>
                      </Form>
                    </td>
                  </tr>

                </>
              )
            })}
          </tbody>
        </Table>
      </Container>
    </>
  )


}


export default RequestTable

// const TableStyle = styled(Table)`

// th {background: #1F386B;color : white;}
// tr{
//     cursor:pointer;
//     &:hover{
//         background: lightgray;
//     }
// }
// `;


// const Btn = styled(Button)`
//     background :#EFBB20;
//     border: none;
//     &:hover{
//     background: #0e8ccc;
// }`;
