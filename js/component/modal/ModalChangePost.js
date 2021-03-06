// eslint-disable-next-line no-undef
define(['base/component', 'css!component/modal/ModalCreatePost'], function (Component) {
    'use strict';
    var tensor = new URL ('https://tensor-school.herokuapp.com/');

    class ModalChangePost extends Component{
        constructor(data){
            super();
            this.post = data.post;
            this.user_id = data.myid;
            this.current_id = data.currid;
            this.isSave = false;
            this.isUpdate = false;
            this.idPhotosBeforeUpdate = {};
            this.idPhotosAfterUpdate = {};
            this.idPhotosWasUpdate = {};
            this.forDelete = {};
        }

        render(){
            return `<div class='createrPost'>
                        <p class='createrPost__text createrPost__header'>Изменение записи</p>
                        <textarea class='createrPost__fieldForText' placeholder="Введите текст записи">${this.post.text}</textarea>
                        <p class='createrPost__text'>Вы можете перенести сюда фото</p>
                        <div class='createrPost__fieldForImg'>
                            <div class='uploadingPhoto'>
                            </div>
                        </div>
                        <div class='unvisibleField'>
                            <input type="file" id="fileElem" multiple accept="image/*" onchange="handleFiles(this.files)">
                        </div>
                        <div class='createrPost__text createrPost__buttons'>
                            <p class='createrPost__buttonUnvisibleField'>Или загрузить через проводник</p>
                            <p class='createrPost__buttonCreate'>Сохранить</p>
                        </div>
                    </div>`;
        }

        afterMount(){
            this.putUploadPhoto();
            document.querySelector('.modal-content').classList.add('modal-content_big');
            this.subscribeTo(this.getContainer(), 'click', this.chooseAction.bind(this));
            this.putCurrentListPhotos(this.idPhotosBeforeUpdate);
            
            //установка всех событий на элемент для drop
            let elementForDrop = document.querySelector('.createrPost__fieldForImg');
            let arrayOfEvents = ['dragenter', 'dragover', 'dragleave', 'drop'];
            arrayOfEvents.forEach(eventName => this.subscribeTo(elementForDrop, eventName, this.preventDefaults));
            ['dragenter', 'dragover'].forEach(eventName => this.subscribeTo(elementForDrop, eventName, this.makeBigField));
            ['dragover', 'drop'].forEach(eventName => this.subscribeTo(elementForDrop, eventName, this.setCopyFiles));
            ['dragleave', 'drop'].forEach(eventName => this.subscribeTo(elementForDrop, eventName, this.makeLittleField));
            document.querySelector('input[id=fileElem]').onchange = this.fromAddButtton.bind(this);
            this.subscribeTo(elementForDrop, 'drop', this.handleDrop.bind(this));
            //this.clearGallery();
        }

        beforeUnmount(){
            let arrayOfEvents = ['dragenter', 'dragover', 'dragleave', 'drop', 'click'];
            arrayOfEvents.forEach(eventName => this.unsubscribeByEvent(eventName));

            if(!this.isSave){
                for (let photo in this.post.img){
                    let key = this.getKeyFromString(this.post.img[photo]); 
                
                    if (key in this.idPhotosWasUpdate){
                        delete this.idPhotosWasUpdate[key];
                    }
                }

                for (let photo in this.idPhotosWasUpdate){
                    this.deletePhoto(photo);
                }
                this.isSave = true;
            } 
        }

        getKeyFromString(string){
            let position = string.lastIndexOf('/');
            let numberInStr = string.substring(position + 1);
            let number = parseInt(numberInStr, 10);
            return number;
        }

        putUploadPhoto(){
            let classForImg = 'uploadingPhoto_img';
            for (let photo in this.post.img){
                let srcPhoto = new URL (this.post.img[photo], tensor);
                let img = document.createElement('img');
                img.src = srcPhoto;
                img.title = 'Нажмите на фото, чтобы удалить его';
                img.id = this.getKeyFromString(this.post.img[photo]);
                img.className = classForImg;
                document.querySelector('.uploadingPhoto').appendChild(img);
                let key = this.getKeyFromString(this.post.img[photo]);
                this.idPhotosWasUpdate[key] = this.post.img[photo];
            }
        }

        //добавление подписи загрузки
        createLabelUpload(){
            let path = document.querySelector('.createrPost__fieldForImg');
            let elem = document.createElement('p');
            
            elem.innerText = 'Производится загрузка, пожалуйста подождите...';
            elem.classList = 'createrPost__text createrPost__text_label';
            path.after(elem);
        }

        //удаление подписи загрузки
        deleteLabelUpload(){
            try {
                let elem = document.querySelector('.createrPost__text_label');
            elem.remove();
            } catch (error) {
                // eslint-disable-next-line no-unused-vars
                let count;
            }
            
        }

        //положить в нужный массив список фотографий
        async putCurrentListPhotos(arrayForPut){
            let ids = await this.getListPhoto();
            this.getId(await ids, arrayForPut);
        }

        //сравнение 2-х массивов и вынесение разницы в дополнительный массив
        compareMassiveAndCreateNew(bigMassive, littleMassive, newMassive){
            for (let elem in bigMassive){
                if(!(elem in littleMassive)) {
                    newMassive[elem] = bigMassive[elem];
                }
            }  
        }
        
        //функция выбора навешиваемой функции
        chooseAction(event){
			if (event.target.classList.contains('createrPost__buttonCreate')) {
				this.changePost();
			} else if (event.target.classList.contains('createrPost__buttonUnvisibleField')) {
				this.openField();
			} else if (event.target.classList.contains('uploadingPhoto_img')) {
				this.preDeletePhoto();
			} 
        }

        preDeletePhoto(){
            event.stopPropagation();
            this.forDelete[event.target.id] = this.idPhotosWasUpdate[event.target.id];
            delete this.idPhotosWasUpdate[event.target.id];
            this.outputUploadFiles();
        }

        //обработчик скидывания
        async handleDrop(){
            let dt = event.dataTransfer;
            let files = await dt.files;
            this.checkCounOfPhoto(await files, this.idPhotosWasUpdate);
        }

        //передача файлов в обработку с доп кнопки
        async fromAddButtton(){
            let dt = event.srcElement;
            let files = await dt.files;
            this.checkCounOfPhoto(await files, this.idPhotosWasUpdate);
        }

        //проверка общего числа фотографий
        checkCounOfPhoto(files, buffer){
            this.createLabelUpload();
            let countPhotoinBuffer = this.lenPamamsOfObject(buffer);
            if ((countPhotoinBuffer + files.length) > 10){
                alert('Количество фото не должно превышать 10');
                let newFiles = [];
                let counter = 0;
                for (let file of files) {
                    counter++;
                    if (counter <= 10 - countPhotoinBuffer){
                        newFiles.push(file);
                    }
                }
                this.handleFiles(newFiles);
            }
            else {
                this.handleFiles(files);
            }
        }

        //выполнение для каждого файла загрузки
        handleFiles(files) {
            let requests = [...files].map(file => this.uploadFile(file)); 
            
            Promise.all(requests)
            .then(() => this.getListPhoto())
            .then(() => this.putCurrentListPhotos(this.idPhotosAfterUpdate))
            .then(() => {this.compareMassiveAndCreateNew(this.idPhotosAfterUpdate, this.idPhotosBeforeUpdate, this.idPhotosWasUpdate);})
            .then(() => {this.setParamsOfFirstMassiveToSecond(this.idPhotosAfterUpdate, this.idPhotosBeforeUpdate); this.outputUploadFiles();});
        }
        
        //количество параметров в объекте
        lenPamamsOfObject(object){
            let count = 0;
            // eslint-disable-next-line no-unused-vars
            for (let key in object)
            {
                count = count + 1;
            }
            return count;
        }

        //вывод загруженных фото
        outputUploadFiles(){
            let classForImg = 'uploadingPhoto_img';
            let imagesOnForm = document.querySelectorAll(`.${classForImg}`);
            let lenOfMassive = this.lenPamamsOfObject(this.idPhotosWasUpdate);
            
            if (imagesOnForm.length != lenOfMassive){
                document.querySelector('.uploadingPhoto').innerHTML='';
                for (let photo in this.idPhotosWasUpdate){
                    let srcPhoto = new URL (this.idPhotosWasUpdate[photo], tensor);
                    let img = document.createElement('img');
                    img.src = srcPhoto;
                    img.id = photo;
                    img.title = 'Нажмите на фото, чтобы удалить его';
                    img.className = classForImg;
                    document.querySelector('.uploadingPhoto').appendChild(img);
                }
            }
            this.deleteLabelUpload();
        }

        //приравнивание значений 2-х объектов
        setParamsOfFirstMassiveToSecond(firstMassive, secondMassive){
            for (let key in firstMassive){
                secondMassive[key] = firstMassive[key];
            }
        }

        //загрузка
        async uploadFile(file){
            let loadPhoto = new URL ('/photo/upload', tensor);
            let response = await fetch(loadPhoto, {
                method : 'POST',
                headers: {'Content-Type': 'image/png'},
                body: file,
                credentials: 'include'
                }).catch(() => alert('Не удалось загрузить фото, попробуйте еще раз'));

            if (response.status == 201) {
                return await response;
            }

            throw new Error (response.status);         
        }

        //получение всех Id фотографий для работы с ними
        async getListPhoto(){
            // eslint-disable-next-line no-undef
            let getPhotos = new URL (`/photo/list/${this.user_id}`, tensor);
            let response = await fetch(getPhotos, {
                method : 'GET',
				mode: 'cors',
                credentials: 'include'
            });
            if (response.status == 200) {
                let json = await response.json();
                return await json.photos;
            }

            throw new Error (response.status); 
        }

        //добавление id к массиву
        getId(startArrayOfIds, finalArrayOfIds){
            for (let key in startArrayOfIds) {
                finalArrayOfIds[startArrayOfIds[key]['id']] = startArrayOfIds[key]['path'];
            }
        } 

        //очистка галереи (вспомогательная функция при разработке)
        clearGallery(){
            // eslint-disable-next-line no-undef
            let getPhotos = new URL (`/photo/list/${user_id}`, tensor);

            fetch(getPhotos, {
                method : 'GET',
				mode: 'cors',
                credentials: 'include'
            }).then(response => response.json())
            .then(result => result.photos) 
            .then(photos => {for (let photo of photos){
                this.deletePhoto(photo.id);
            }});
        }

        //удаление фото
        deletePhoto(photo){
            let urlencoded = new URLSearchParams();
            urlencoded.append('photo_id', photo);
            let deletePhoto = new URL ('/photo/delete', tensor);

            fetch(deletePhoto, {
                method : 'POST',                
				mode: 'cors',
                headers: {'Content-Type' : 'application/x-www-form-urlencoded'},
				body: urlencoded,
                credentials: 'include'
            }).then(response => response)
            .catch(error => console.log('error', error));
        }

        //увеличение поля при наведение на него и обведение жирным
        makeBigField() {
            let field = document.querySelector('.createrPost__fieldForImg');
            field.style['min-height'] = '150px';
            field.style.border = 'dashed';
        }

        //уменьшение поля при сбрасывании файла или переноса
        makeLittleField() {
            let field = document.querySelector('.createrPost__fieldForImg');
            field.style['min-height'] = '30px';
            field.style.border = 'dashed thin';
        }

        //отмена выполнения обработчика браузера и всплытия 
        preventDefaults() {
            event.preventDefault();
            event.stopPropagation();
        }

        //задание копирования файлов
        setCopyFiles(){
            event.dataTransfer.dropEffect = 'copy';
        }

        //Открытие скрытого поля при нажатии
        openField(){
            document.querySelector('.unvisibleField').style.display = 'block';
        }

        //Преобразование ссылок на фото в строку
        getStrOfLinksPhotos(object){
            let str = this.createDate();
            for (let key in object){
                str = str + ','+ object[key] ;
            }
            return str;
        }

        // создание даты для сообщения
        createDate(){
            let now = new Date();
            let month = now.getMonth() + 1 < 10? '0' + (now.getMonth() + 1).toString() : (now.getMonth() + 1 ).toString();
            let day = now.getDate() < 10? '0' + now.getDate().toString():now.getDate().toString();
            let hours = now.getUTCHours() < 10? '0' + now.getUTCHours().toString():now.getUTCHours().toString();
            let minutes = now.getUTCMinutes() < 10? '0' + now.getUTCMinutes().toString():now.getUTCMinutes().toString();
            let seconds = now.getSeconds() < 10? '0' + now.getSeconds().toString():now.getSeconds().toString();

            return `${now.getFullYear()}-${month}-${day}T${hours}:${minutes}:${seconds}`;
        }

        replace(str, elemForPeplace, newElem){
			let newStr = '';
			for (let char = 0; char < str.length; char++){
				if (str[char] !== elemForPeplace){
					newStr += str[char];
				}
				else {
					newStr += newElem;
				}
			}
			return newStr;
		}

        //Сохрание данных по нажатию (в разработке)
        changePost(){
            event.stopPropagation();
            this.isSave = true;
            let text = document.querySelector('.createrPost__fieldForText').value;

            if(text.length != 0 || this.lenPamamsOfObject(this.idPhotosWasUpdate)!= 0)
            {
                let encodeText = this.replace(text, '\n', '</br>');
                let textObject = {
                    type : 'post',
                    text : encodeText
                };
                let textForSend = JSON.stringify(textObject);
                let linksForPhotos = this.getStrOfLinksPhotos(this.idPhotosWasUpdate);
                let urlencoded = new URLSearchParams();
                urlencoded.append('id', this.post.id);
                urlencoded.append('author', this.user_id);
                //urlencoded.append('addressee', this.current_id);
                urlencoded.append('message', textForSend);
                urlencoded.append('image', linksForPhotos);
                let updatePost = new URL ('/message/update', tensor);

                fetch(updatePost, {
                    method : 'POST',                
                    mode: 'cors',
                    headers: {'Content-Type' : 'application/x-www-form-urlencoded'},
                    body: urlencoded,
                    credentials: 'include'
                }).then(() => this.deleteUnneedPhotos())
                .then(() => this.Close())
                .catch(error => console.log('error', error));
            }
            else {
                this.Close();
            }
            
        }

        deleteUnneedPhotos(){
            for(let photo in this.forDelete){
                this.deletePhoto(photo);
            }
        }

        //Вызов события закрытия кнопки окна
        Close() {
            let clickEvent = new Event('click');
            document.querySelector('.modal').dispatchEvent(clickEvent);
            this.updating();
        }

         //Вызов обновления стены 
        updating() {
            if (!this.isUpdate){
                let updatingEvent = new Event('update');
                document.querySelector('.content-wall').dispatchEvent(updatingEvent);
                this.isUpdate = true;
            }
        }
    }

    return ModalChangePost;
});