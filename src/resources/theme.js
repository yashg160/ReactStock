import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#af0404',
            light: '#ff0000'
        },
        secondary: {
            main: '#252525',
            light: '#414141'
        }
    },
    typography: {
        fontFamily: 'Nunito'
    }
});

export default theme;