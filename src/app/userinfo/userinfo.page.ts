import { Component, OnInit, ViewChild } from '@angular/core';
import firebase from 'firebase';
import * as moment from 'moment';
import {
  IonInfiniteScroll,
  MenuController,
  NavController,
  AlertController,
  ToastController,
  LoadingController,
  ActionSheetController
} from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx'

@Component({
  selector: 'app-userinfo',
  templateUrl: './userinfo.page.html',
  styleUrls: ['./userinfo.page.scss'],
})

export class UserinfoPage implements OnInit {

  //firebase auth
  name: string;
  email: string;
  photoUrl: string;
  uid: string;
  emailVerified: boolean;
  idDocUsers: string;

  tel: string;
  nasc: string;
  sexo: string;
  att: string;
  cidade: string;


  image: string;

  constructor(
    private menu: MenuController,
    public navCtrl: NavController,
    public alertController: AlertController,
    public toastCtrl: ToastController,
    public actionSheetController: ActionSheetController,
    private camera: Camera) {

  }

  ngOnInit() {
    this.getUserInfo();
  }

  //abrir menu
  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  //obter informações do usuário
  getUserInfo() {
    console.log("Recolhendo as informações do usuário");
    this.name = "Carregando...";
    this.email = "Carregando...";

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.name = user.displayName;
        this.email = user.email;
        this.photoUrl = user.photoURL;
        this.emailVerified = user.emailVerified;
        this.uid = user.uid;
        console.log("Usuário " + this.name + " logado");
        console.log("email: " + this.email);
        console.log("photoUrl: " + this.photoUrl);
        console.log("emailVerified: " + this.emailVerified);
        console.log("uid: " + this.uid);
        this.obterMaisInfo()
      } else {
        console.log("Não foi possível recolher as informações");
        this.navCtrl.navigateRoot('/');
      }
    });
  }
  
  //obter outras informações do usuario
  obterMaisInfo() {
    let query = firebase.firestore().collection("users").where("owner", "==", this.uid);
    query.get()
      .then((docs) => {
        docs.forEach((doc) => {
          this.tel = doc.data().tel;
          this.cidade = doc.data().cidade;
          this.nasc = moment(doc.data().nasc).format("DD/MM/YYYY");
          this.sexo = doc.data().sexo;
          this.att = moment(doc.data().created.toDate()).format("DD/MM/YYYY HH:mm");
          this.obterIDdoUsuario();
        })
      }).catch((err) => {
        console.log(err);
      })

  }

  //sair
  logout() {
    firebase.auth().signOut().then(() => {
      console.log("Sign-out successful");
      this.navCtrl.navigateRoot('/login');
    }).catch(async (error) => {
      console.log("An error happened: " + error);
      const toast = await this.toastCtrl.create({
        message: error,
        duration: 3000
      });
      toast.present();
    });
  }



  //abrir popup de email
  async alterarEmailPopup() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Alterar email',
      inputs: [
        {
          name: 'text',
          id: 'text',
          type: 'email',
          placeholder: 'user@example.com'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Alterar',
          handler: (alertData) => {
            console.log('Confirm Ok');
            this.alterarEmail(alertData.text);
            var email = alertData.text;
            console.log('Confirm Ok: ' + email);
            const data = {
              email: email
            };
            firebase.firestore().collection("users").doc(this.idDocUsers).update(data);
          }
        }
      ]
    });

    await alert.present();
  }

  //alterar email
  alterarEmail(email: string) {
    firebase.auth().currentUser.verifyBeforeUpdateEmail(email)
      .then(async () => {
        console.log("Email de verificação enviado");
        const toast = await this.toastCtrl.create({
          message: "Email de verificação enviado",
          duration: 3000
        });
        toast.present();
      })
      .catch(async (error) => {
        console.log(error);
        const toast = await this.toastCtrl.create({
          message: error,
          duration: 3000
        });
        toast.present();
      });
  }



  //abrir popup de nome
  async alterarNomePopup() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Alterar nome',
      inputs: [
        {
          name: 'text',
          id: 'text',
          type: 'email',
          placeholder: 'Digite seu nome'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Alterar',
          handler: (alertData) => {
            console.log('Confirm Ok');
            this.alterarNome(alertData.text);
            var nome = alertData.text;
            console.log('Confirm Ok: ' + nome);
            const data = {
              owner_name: nome
            };
            firebase.firestore().collection("users").doc(this.idDocUsers).update(data);
          }
        }
      ]
    });

    await alert.present();
  }

  //alterar nome
  alterarNome(name: string) {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log("Usuário logado");
        user.updateProfile({
          displayName: name
        }).then((user) => {
          console.log("Nome alterado");
          this.getUserInfo();
        }, async (error) => {
          console.log("Ocorreu um erro: " + error);
          const toast = await this.toastCtrl.create({
            message: error,
            duration: 3000
          });
          toast.present();
        });
      } else {
        console.log("Nenhum usuário logado. Redirecionando à tela de login");
        this.navCtrl.navigateRoot('/');
      }
    });
  }



  //abrir popup de senha
  async alterarSenhaPopup() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Alterar senha',
      inputs: [
        {
          name: 'text',
          id: 'text',
          type: 'password',
          placeholder: 'Digite sua nova senha'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Alterar',
          handler: (alertData) => {
            console.log('Confirm Ok');
            this.alterarSenha(alertData.text);
          }
        }
      ]
    });

    await alert.present();
  }

  //alterar senha
  alterarSenha(senha: string) {
    firebase.auth().currentUser.updatePassword(senha)
      .then( async () => {
        console.log("Senha alterada");
        const toast = await this.toastCtrl.create({
          message: "Senha alterada",
          duration: 3000
        });
        toast.present();
      })
      .catch(async (error) => {
        console.log("Ocorreu um erro: " + error);
        const toast = await this.toastCtrl.create({
          message: error,
          duration: 3000
        });
        toast.present();
      });
  }



  //abrir popup de deletar conta
  async deletarContaPopup() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Deletar conta',
      message: 'Você tem certeza que quer deletar sua conta? Essa ação não pode ser desfeita',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Deletar',
          handler: (alertData) => {
            console.log('Confirm Ok');
            this.deletarConta();
          }
        }
      ]
    });

    await alert.present();
  }

  //deletar conta
  deletarConta() {
    firebase.auth().currentUser.delete()
      .then(() => {
        console.log("Conta deletada");
      })
      .catch(async (error) => {
        console.log("Ocorreu um erro: " + error);
        const toast = await this.toastCtrl.create({
          message: error,
          duration: 3000
        });
        toast.present();
      });
  }





  //

  //abrir popup de nome
  async alterarTelefonePopup() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Alterar telefone',
      inputs: [
        {
          name: 'text',
          id: 'text',
          type: 'text',
          placeholder: '5519987654321'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Alterar',
          handler: (alertData) => {
            var telefone = alertData.text;
            console.log('Confirm Ok: ' + telefone);
            const data = {
              tel: telefone
            };
            firebase.firestore().collection("users").doc(this.idDocUsers).update(data);
          }
        }
      ]
    });

    await alert.present();
  }


    //abrir popup de nome
    async alterarSexoPopup() {
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Alterar sexo',
        inputs: [
          {
            name: 'text',
            id: 'text',
            type: 'text',
            placeholder: 'Mulher Trans'
          },
        ],
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Confirm Cancel');
            }
          }, {
            text: 'Alterar',
            handler: (alertData) => {
              var sexo = alertData.text;
              console.log('Confirm Ok: ' + sexo);
              const data = {
                sexo: sexo
              };
              firebase.firestore().collection("users").doc(this.idDocUsers).update(data);
            }
          }
        ]
      });
  
      await alert.present();
    }


      //abrir popup de nome
  async alterarNascimentoPopup() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Alterar nascimento',
      inputs: [
        {
          name: 'text',
          id: 'text',
          type: 'text',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Alterar',
          handler: (alertData) => {
            var nasc = alertData.text;
            console.log('Confirm Ok: ' + nasc);
            const data = {
              nasc: nasc
            };
            firebase.firestore().collection("users").doc(this.idDocUsers).update(data);
          }
        }
      ]
    });

    await alert.present();
  }

  //abrir camera
  tirarFoto() {
    let options: CameraOptions = {
      quality: 80,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      targetHeight: 400,
      targetWidth: 300,
      allowEdit: false
    }

    this.camera.getPicture(options).then((base64Image) => {
      console.log(base64Image);
      this.image = "data:image/png;base64," + base64Image;
      this.uploadImage(this.uid);
    }).catch(async (err) => {
      console.log(err);
      const toast = await this.toastCtrl.create({
        message: err,
        duration: 3000
      });
      toast.present();
    })
  }

  //salvar imagem no banco de dados
  uploadImage(name: string) {
    let ref = firebase.storage().ref("fotoPerfil/" + name);
    let uploadTask = ref.putString(this.image.split(',')[1], "base64");
    uploadTask.on("state_changed", (taskSnapshot) => {
      console.log(taskSnapshot);
    }, (error) => {
      console.log(error);
    }, () => {
      console.log("Upload de imagem concluído");
      uploadTask.snapshot.ref.getDownloadURL().then((url) => {
        console.log(url);
        console.log('Confirm Ok: ' + url);
        const data = {
          imagem: url
        };
        firebase.firestore().collection("users").doc(this.idDocUsers).update(data);

        firebase.auth().onAuthStateChanged((user) => {
          if (user) {
            console.log("Usuário logado");
            user.updateProfile({
              photoURL: url
            }).then((user) => {
              console.log("Imagem alterada");
              this.getUserInfo();
            }, async (error) => {
              console.log("Ocorreu um erro: " + error);
              const toast = await this.toastCtrl.create({
                message: error,
                duration: 3000
              });
              toast.present();
            });
          } else {
            console.log("Nenhum usuário logado. Redirecionando à tela de login");
            this.navCtrl.navigateRoot('/login');
          }
        });

      })
    })
  }

  obterIDdoUsuario() {
    let query = firebase.firestore().collection("users").where("owner", "==", this.uid);
    query.get()
      .then((docs) => {
        docs.forEach((doc) => {
          this.idDocUsers = doc.id;
          console.log("id do documento: " + this.idDocUsers);
        })
      }).catch((err) => {
        console.log(err);
      })

  }

}
