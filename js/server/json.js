// eslint-disable-next-line no-undef
define(function(){
	let answer  = {
		header : {
			photo: 'img/avatar/user_photo.png' 
		},
		information : {
			'id' : 1,
			'name' : 'Ангелина',
			'family' : 'Иванова',
			'about' : 'Дружелюбная и романтичная девушка. Я сентиментальна и не приемлю лож. Люблю дождь и книги',
			'birthday' : '1995-04-12',
			'city' : 'Уфа',
			'family_status' : 'Ищу тебя',
			'education' : 'БГУ 2003',
			'job' : 'Как и место встречи изменить нельзя'
		},
		gallery : {
			images : ['img/gallery/cat1.jpg', 'img/gallery/cat2.jpg', 'img/gallery/cat3.jpg', 'img/gallery/cat4.jpg', 'img/gallery/cat5.jpg', 'img/gallery/cat6.jpg', 'img/gallery/cat7.jpg', 'img/gallery/cat8.jpg']
		},
		wall : [
			{
				id : 1,
				href : '#',
				name : 'Марина',
				family : 'Злотова',
				avatar : 'img/avatar/friend1.jpg',
				date : '2020-04-21T23:56:00',
				text: 'Но она влюблена в своего космонавта',
				img : ['img/post/wall1.jpg'],
				audio : [],
				video : [],
				delete : true,
				comments: [
					{
						name : '',
						family : '',
						avatar : '',
						date : '',
						text: ''
					} ,
					{
						name : '',
						family : '',
						avatar : '',
						date : '',
						text: ''
					}
				]
			},
			{
				id : 2,
				href : '#',
				name : 'Миша',
				family : 'Голосов',
				avatar : 'img/avatar/friend2.jpg',
				date : '2020-04-22T01:50:00',
				text: 'Я Свободен!!!',
				img : ['img/post/wall2.jpg', 'img/post/wall1.jpg'],
				audio : [],
				video : [],
				delete : true,
				comments: [
					{
						name : '',
						family : '',
						avatar : '',
						date : '',
						text: ''
					} ,
					{
						name : '',
						family : '',
						avatar : '',
						date : '',
						text: ''
					}
				]
			}
		],
		avatar : {
			photo: 'img/avatar/user_photo.png' 
		},
		messages : [
			{
				id : 1,
				href : '#',
				name : 'Марина',
				family : 'Злотова',
				avatar : 'img/avatar/avatar1.jpg',
				date : '14:56',
				text: 'Далеко-далеко за словесными горами в стране, гласных и согласных живут рыбные тексты. Дороге встретил повстречался свой использовало имеет свое приставка оксмокс жаренные послушавшись! Ее домах своего дороге продолжил всемогущая родного диких переписывается!',
				img : [],
				audio : [],
				video : []
			},
			{
				id : 2,
				href : '#',
				name : 'Марина',
				family : 'Злотова',
				avatar : 'img/avatar/avatar1.jpg',
				date : '14:56',
				text: 'Далеко-далеко за словесными горами в стране.',
				img : [],
				audio : [],
				video : []
			},
			{
				id : 3,
				href : '#',
				name : 'Марина',
				family : 'Злотова',
				avatar : 'img/avatar/avatar1.jpg',
				date : '14:56',
				text: '1111111111111111111111111111111111111111111111111111111111111111111111111111',
				img : [],
				audio : [],
				video : []
			},
			{
				id : 4,
				href : '#',
				name : 'Марина',
				family : 'Злотова',
				avatar : 'img/avatar/avatar1.jpg',
				date : '14:56',
				text: '11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111',
				img : [],
				audio : [],
				video : []
			}
		],
		music: [{
			name: 'Tom Rosental - All of Them Dreams',
			src: 'mp3/All of Them Dreams.mp3'
		},{
			name: 'The XX - Crystalised',
			src: 'mp3/Crystalised.mp3'
		},{
			name: 'The Irrepressible - In This Shirt',
			src: 'mp3/In This Shirt.mp3'
		},{
			name: 'Tom Rosental - It\'s OK',
			src: 'mp3/It\'s OK.mp3'
		},
		{
			name: 'The XX - Night Time',
			src: 'mp3/Night Time.mp3'
		},{
			name: 'Seafret - Be My Queen',
			src: 'mp3/Be My Queen.mp3'
		},{
			name: 'David Rawlings - Cumberland Gap',
			src: 'mp3/Cumberland.mp3'
		},{
			name: 'Sueco the Child - Fast',
			src: 'mp3/Fastmp3'
		},{
			name: 'Dotan - Home',
			src: 'mp3/Home.mp3'
		},{
			name: 'Palaye Royale - Little Bastards',
			src: 'mp3/Little Bastards.mp3'
		},{
			name: 'Royal Deluxe - No Limits',
			src: 'mp3/No Limits.mp3'
		}],
		friends: [
			{
				name: 'Марина',
				surname: 'Злотова',
				img: 'img/avatar/friend1.jpg'
			},
			{
				name: 'Миша',
				surname: 'Голосов',
				img: 'img/avatar/friend2.jpg'
			},
			{
				name: 'Андрей',
				surname: 'Алексеев',
				img: 'img/avatar/friend3.jpg'
			},
			{
				name: 'Владимир',
				surname: 'Петров',
				img: 'img/avatar/friend4.jpg'
			},
		]

	};

	return answer;
});