import Spinner from 'react-bootstrap/Spinner'
const Loading = () => {
    return ( 
        <div style={loadingStyle}>
              <Spinner animation="grow" variant="success" />
        </div>
     );
}

const loadingStyle = {
    hight: '100vh',
    width: '100%',
    backgroundColor: '#2B2B2B',
    display: 'grid',
    placeItems: 'center'
}
 
export default Loading;