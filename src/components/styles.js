import backgroundImage from '../images/seattle.jpg';

export default {
    background: {
        height: '100vh',
        width: '100vw',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex'
    },
    h4: {
        color: 'white',
        marginTop: '10%',
        fontFamily: "'Helvetica', serif"
    },
    h5: {
        color: 'yellow',
        fontFamily: "'Helvetica', cursive",
        marginTop: '10%',
    },

    h1: {
        marginTop: '10%'
    }
}