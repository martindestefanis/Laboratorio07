import React, {Component} from 'react';
import {ToastAndroid,Button, StyleSheet, Text, TextInput, Picker, View, Switch, CheckBox, Slider ,Alert} from 'react-native';

function plazoFijo(dias,monto){
    var tasas=tasa(dias,monto);
    return (monto*(Math.pow(1.0+(tasas/100.0),(dias)/360.0)-1.0));
}
function tasa(dias,capitalInicial) {
    const tasas= [0.25,0.275,0.30,0.323,0.35,0.0385];
    if (dias < 30 && capitalInicial <= 5000) return (tasas[0]);
    if (dias >= 30 && capitalInicial <= 5000) return (tasas[1]);
    if (dias < 30 && capitalInicial >= 5000 && capitalInicial <= 99999) return (tasas[2]);
    if (dias >= 30 && capitalInicial >= 5000 && capitalInicial <= 99999) return (tasas[3]);
    if (dias < 30 && capitalInicial >= 99999) return (tasas[4]);
    if (dias >= 30 && capitalInicial >= 99999) return (tasas[5]);
    return 0.0;
}

export default class AppBanco extends Component {
    constructor(props) {
        super(props);
        this.state = {
            moneda: 1, capitalInicial: 0, capitalFinal: 0, dias: 10,correo:'',CUIT:0, text:'',condiciones:false
        };
       this.hacerPlazoFijo = this.hacerPlazoFijo.bind(this);
    }

    hacerPlazoFijo() {
      if(this.state.correo.trim()=='') {
          ToastAndroid.show('Debe completarsu email', ToastAndroid.LONG);
      }else if(this.state.CUIT==0 && this.state.CUIT.trim().textLength!=13){
          ToastAndroid.show('Debe ingresar un cuit correcto 00-00000000-0 ', ToastAndroid.LONG);
      }else if(this.state.capitalInicial==0){
          ToastAndroid.show('Debe ingresar un monto mayor a 0', ToastAndroid.LONG);
      }else if(this.state.condiciones==false){
          ToastAndroid.show('Debe aceptar los terminos y condiciones', ToastAndroid.LONG);
      }else{
          this.setState({capitalFinal: plazoFijo(this.state.dias, this.state.capitalInicial) });
          var capitalF=this.state.capitalFinal;
          var capitalI=this.state.capitalInicial;
          this.setState({text:  'El plazo fijo se realizó correctamente \n' +
                                'Datos del plazo fijo: \n' +
                                'Dias: '+ this.state.dias + '\n' +
                                'Monto inicial: ' + this.state.capitalInicial + '\n' +
                                'Interés: ' + plazoFijo(this.state.dias, this.state.capitalInicial) + '\n' +
                                'Monto con intereses: ' + (parseFloat(capitalI)+parseFloat(capitalF)) + '\n'});

          //Hay que hacer doble click en hacer plazo fijo para que actualice el capitalFianal no sé porqué
          ToastAndroid.show('Para que actualice monto con intereses se debe hacer doble click en "hacer plazo fijo. No tenemos idea porque tarda en actualizar el estado"', ToastAndroid.LONG);
      }

    }

    render() {
        return (
            <View style={styles.container}>
                <Text>Correo Electronico</Text>
                <TextInput
                    keyboardType = 'email-address'
                    onChangeText={(typedText) => {this.setState({correo: typedText})}}>correo@mail.com</TextInput>
                <Text>CUIT</Text>
                <TextInput
                    keyboardType = 'numeric'
                    onChangeText={(typedText) => {this.setState({CUIT: typedText})}}>00-00000000-0</TextInput>
                <Text>Moneda</Text>
                <Picker style={{width: 200}}
                        selectedValue={this.state.moneda}
                        onValueChange={(valor) => this.setState({moneda: valor})}>
                    <Picker.Item label="Dolar" value="1"/>
                    <Picker.Item label="Pesos ARS" value="2"/>
                </Picker>
                <Text>Monto</Text>
                <TextInput
                    keyboardType = 'numeric'
                    value={0}
                    onChangeText={(typedText) => {this.setState({capitalInicial: typedText})}}>0</TextInput>
                <Text>Dias</Text>
                <Slider
                    value={10}
                    step={1}
                    minimumValue={10}
                    maximumValue={180}
                    width={180}
                    onValueChange={(valor) => this.setState({dias: valor})}>
                </Slider>
                <Text> {this.state.dias} </Text>
                <Text>Avisar por mail</Text>
                <Switch></Switch>
                <Text>Acepto condiciones</Text>
                <CheckBox
                    onValueChange={(valor) => this.setState({condiciones: valor})}/>

                <Button title="Hacer Plazo Fijo"
                        color="#FF0000"
                        onPress={this.hacerPlazoFijo}>
                </Button>
                <Text>{this.state.text}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});