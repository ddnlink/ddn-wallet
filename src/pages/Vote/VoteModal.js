import React, { PureComponent } from 'react';
import { Button, Modal, Icon, Row, Col } from 'antd';
import { formatMessage } from 'umi/locale';

const leftStyle = {
  textAlign:'left'
}
const rightStyle = {
  textAlign:'right',
  marginLeft:"20px"
}
const evenStyle = {
  padding:"10px",
  borderBottom:"1px solid #e5e5e5",
  backgroundColor:"#f5f5f5"
}
const oddStyle = {
  borderBottom:"1px solid #e5e5e5",
  padding:"10px"
}
class VoteModal extends PureComponent {

  constructor(props){
    super(props)
    this.state={
      visible: false
    }
  }

  handleOpenModal = () =>{
    this.setState({visible: true})
  }

  handleCloseModal = () =>{
    this.setState({visible: false})
  }

  handleVoteDelegate = () =>{
    const { handleVoteDelegate, selectedRows } = this.props
    if(handleVoteDelegate){
      handleVoteDelegate(selectedRows)
    }
    this.setState({visible: false})
  }

  render() {
    const { visible } = this.state
    const { selectedRows, deVote } = this.props
    return (
      <div>
        <Button type='primary' onClick={this.handleOpenModal}><Icon type={deVote ? 'dislike':'like'} theme="outlined" style={{marginRight:"5px"}} />
          {deVote ? formatMessage({ id: 'app.vote.devote' }) : formatMessage({ id: 'app.vote.vote' })}
        </Button>
        <Modal
          title={deVote ? formatMessage({ id: 'app.vote.devote-for-delegate' }) : formatMessage({ id: 'app.vote.vote-for-delegate' })}
          centered
          visible={visible}
          bodyStyle={{ padding: '20px 10px' }}
          footerStyle={{ margin:"20px"}}
          onCancel={this.handleCloseModal}
          onOk={this.handleVoteDelegate}
          okText={deVote ? formatMessage({ id: 'app.vote.sure-to-devote' }) : formatMessage({ id: 'app.vote.sure-to-vote' })}
          destroyOnClose
        >
          <div style={{textAlign:"center", margin:"20px"}}>{formatMessage({ id: 'app.vote.info' })} 0.1 DDN</div>
          {selectedRows.map((selectedRow, index) => {
            const component = (
              <div key={selectedRow.username}>
                <Row style={(index%2) ? oddStyle : evenStyle}>
                  <Col span={6}>
                    <div style={leftStyle}>{selectedRow.username}</div>
                  </Col>
                  <Col span={18}>
                    <div style={rightStyle}>{selectedRow.address}</div>
                  </Col>
                </Row>
              </div>)
            return component
          })}
        </Modal>
      </div>
    )
  }
}

export default VoteModal;
