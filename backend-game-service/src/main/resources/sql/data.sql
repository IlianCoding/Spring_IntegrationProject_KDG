-- Characters
Insert into game_character (id, color, name, number, image, description)
values ('667f90a9-93ae-4539-a75a-655be71ae893', 'NONE', 'Assassin', 1, 'https://i.imgur.com/d8lZnyC.png',
        'The Assassin eliminates another character of your choice during the round, preventing them from taking any actions.'),
       ('4d29d9a3-93a8-4548-a464-eef0a29b4233', 'NONE', 'Thief', 2, 'https://i.imgur.com/iyUgxRV.png',
        'The Thief steals all gold from another player of your choice, leaving them empty-handed.'),
       ('bd122d72-00b8-4f3c-81d6-b97e5b138aa9', 'NONE', 'Magician', 3, 'https://i.imgur.com/2vnilLu.png',
        'The Magician can exchange cards with the deck or trade hands with another player.'),
       ('881cf5fc-2d10-4cc9-92cc-0b6ac31b1eea', 'YELLOW', 'King', 4, 'https://i.imgur.com/BDUnOhf.png',
        'The King collects income from yellow buildings and gets to choose the order of character selection next round.'),
       ('c535c984-3fc0-48e5-99fc-8c0c41dda04e', 'BLUE', 'Bishop', 5, 'https://i.imgur.com/4eIIDWw.png',
        'The Bishop collects income from blue buildings and is immune to the Warlord’s attacks.'),
       ('b5043a11-d82a-4449-970d-2c21feb9a5be', 'GREEN', 'Merchant', 6, 'https://i.imgur.com/m54LnqO.png',
        'The Merchant earns extra gold and collects income from green buildings, making them a wealthy target.'),
       ('61ea6680-ec46-4aba-9996-f3cdaf9ad121', 'NONE', 'Architect', 7, 'https://i.imgur.com/qz5RTEM.png',
        'The Architect can draw extra cards and build up to three buildings during their turn.'),
       ('3dcca43f-c830-4a54-8380-4abf4ff4754d', 'RED', 'Warlord', 8, 'https://i.imgur.com/x67uwS2.png',
        'The Warlord collects income from red buildings and can destroy one district by paying its cost.');


-- CharacterDeck
Insert into character_deck(id)
values ('b262d2f3-7a52-46e3-af5a-9713e73770e0');

--character_deck_characters
Insert into character_deck_characters(character_deck_id, characters_id)
VALUES ((select id from character_deck), (select id from game_character where name = 'Assassin'));
Insert into character_deck_characters(character_deck_id, characters_id)
VALUES ((select id from character_deck), (select id from game_character where name = 'Thief'));
Insert into character_deck_characters(character_deck_id, characters_id)
VALUES ((select id from character_deck), (select id from game_character where name = 'Magician'));
Insert into character_deck_characters(character_deck_id, characters_id)
VALUES ((select id from character_deck), (select id from game_character where name = 'Warlord'));
Insert into character_deck_characters(character_deck_id, characters_id)
VALUES ((select id from character_deck), (select id from game_character where name = 'Bishop'));
Insert into character_deck_characters(character_deck_id, characters_id)
VALUES ((select id from character_deck), (select id from game_character where name = 'Merchant'));
Insert into character_deck_characters(character_deck_id, characters_id)
VALUES ((select id from character_deck), (select id from game_character where name = 'Architect'));
Insert into character_deck_characters(character_deck_id, characters_id)
VALUES ((select id from character_deck), (select id from game_character where name = 'King'));

-- Buildings
Insert into building(id, name, cost, color, number, img_url)
values (gen_random_uuid(), 'Manor', 3, 'YELLOW', 1, 'http://ciudadelas.net/images/ciudadelas/card19.jpg'),
       (gen_random_uuid(), 'Manor', 3, 'YELLOW', 2, 'http://ciudadelas.net/images/ciudadelas/card19.jpg'),
       (gen_random_uuid(), 'Manor', 3, 'YELLOW', 3, 'http://ciudadelas.net/images/ciudadelas/card19.jpg'),
       (gen_random_uuid(), 'Manor', 3, 'YELLOW', 4, 'http://ciudadelas.net/images/ciudadelas/card19.jpg'),
       (gen_random_uuid(), 'Manor', 3, 'YELLOW', 5, 'http://ciudadelas.net/images/ciudadelas/card19.jpg'),
       (gen_random_uuid(), 'Castle', 4, 'YELLOW', 6, 'http://ciudadelas.net/images/ciudadelas/card18.jpg'),
       (gen_random_uuid(), 'Castle', 4, 'YELLOW', 7, 'http://ciudadelas.net/images/ciudadelas/card18.jpg'),
       (gen_random_uuid(), 'Castle', 4, 'YELLOW', 8, 'http://ciudadelas.net/images/ciudadelas/card18.jpg'),
       (gen_random_uuid(), 'Castle', 4, 'YELLOW', 9, 'http://ciudadelas.net/images/ciudadelas/card18.jpg'),
       (gen_random_uuid(), 'Castle', 4, 'YELLOW', 10, 'http://ciudadelas.net/images/ciudadelas/card18.jpg'),
       (gen_random_uuid(), 'Palace', 5, 'YELLOW', 11, 'http://ciudadelas.net/images/ciudadelas/card21.jpg'),
       (gen_random_uuid(), 'Palace', 5, 'YELLOW', 12, 'http://ciudadelas.net/images/ciudadelas/card21.jpg'),
       (gen_random_uuid(), 'Temple', 1, 'BLUE', 13, 'http://ciudadelas.net/images/ciudadelas/card9.jpg'),
       (gen_random_uuid(), 'Temple', 1, 'BLUE', 14, 'http://ciudadelas.net/images/ciudadelas/card9.jpg'),
       (gen_random_uuid(), 'Temple', 1, 'BLUE', 15, 'http://ciudadelas.net/images/ciudadelas/card9.jpg'),
       (gen_random_uuid(), 'Church', 2, 'BLUE', 16, 'http://ciudadelas.net/images/ciudadelas/card2.jpg'),
       (gen_random_uuid(), 'Church', 2, 'BLUE', 17, 'http://ciudadelas.net/images/ciudadelas/card2.jpg'),
       (gen_random_uuid(), 'Church', 2, 'BLUE', 18, 'http://ciudadelas.net/images/ciudadelas/card2.jpg'),
       (gen_random_uuid(), 'Monastery', 3, 'BLUE', 19, 'http://ciudadelas.net/images/ciudadelas/card23.jpg'),
       (gen_random_uuid(), 'Monastery', 3, 'BLUE', 20, 'http://ciudadelas.net/images/ciudadelas/card23.jpg'),
       (gen_random_uuid(), 'Monastery', 3, 'BLUE', 21, 'http://ciudadelas.net/images/ciudadelas/card23.jpg'),
       (gen_random_uuid(), 'Monastery', 3, 'BLUE', 22, 'http://ciudadelas.net/images/ciudadelas/card23.jpg'),
       (gen_random_uuid(), 'Cathedral', 5, 'BLUE', 23, 'http://ciudadelas.net/images/ciudadelas/card8.jpg'),
       (gen_random_uuid(), 'Cathedral', 5, 'BLUE', 24, 'http://ciudadelas.net/images/ciudadelas/card8.jpg'),
       (gen_random_uuid(), 'Tavern', 1, 'GREEN', 25, 'http://ciudadelas.net/images/ciudadelas/card6.jpg'),
       (gen_random_uuid(), 'Tavern', 1, 'GREEN', 26, 'http://ciudadelas.net/images/ciudadelas/card6.jpg'),
       (gen_random_uuid(), 'Tavern', 1, 'GREEN', 27, 'http://ciudadelas.net/images/ciudadelas/card6.jpg'),
       (gen_random_uuid(), 'Tavern', 1, 'GREEN', 28, 'http://ciudadelas.net/images/ciudadelas/card6.jpg'),
       (gen_random_uuid(), 'Tavern', 1, 'GREEN', 29, 'http://ciudadelas.net/images/ciudadelas/card6.jpg'),
       (gen_random_uuid(), 'Trading Post', 2, 'GREEN', 30, 'http://ciudadelas.net/images/ciudadelas/card11.jpg'),
       (gen_random_uuid(), 'Trading Post', 2, 'GREEN', 31, 'http://ciudadelas.net/images/ciudadelas/card11.jpg'),
       (gen_random_uuid(), 'Trading Post', 2, 'GREEN', 32, 'http://ciudadelas.net/images/ciudadelas/card11.jpg'),
       (gen_random_uuid(), 'Trading Post', 2, 'GREEN', 33, 'http://ciudadelas.net/images/ciudadelas/card11.jpg'),
       (gen_random_uuid(), 'Market', 2, 'GREEN', 34, 'http://ciudadelas.net/images/ciudadelas/card20.jpg'),
       (gen_random_uuid(), 'Market', 2, 'GREEN', 35, 'http://ciudadelas.net/images/ciudadelas/card20.jpg'),
       (gen_random_uuid(), 'Market', 2, 'GREEN', 36, 'http://ciudadelas.net/images/ciudadelas/card20.jpg'),
       (gen_random_uuid(), 'Market', 2, 'GREEN', 37, 'http://ciudadelas.net/images/ciudadelas/card20.jpg'),
       (gen_random_uuid(), 'Docks', 3, 'GREEN', 38, 'http://ciudadelas.net/images/ciudadelas/card26.jpg'),
       (gen_random_uuid(), 'Docks', 3, 'GREEN', 39, 'http://ciudadelas.net/images/ciudadelas/card26.jpg'),
       (gen_random_uuid(), 'Docks', 3, 'GREEN', 40, 'http://ciudadelas.net/images/ciudadelas/card26.jpg'),
       (gen_random_uuid(), 'Harbor', 4, 'GREEN', 41, 'http://ciudadelas.net/images/ciudadelas/card27.jpg'),
       (gen_random_uuid(), 'Harbor', 4, 'GREEN', 42, 'http://ciudadelas.net/images/ciudadelas/card27.jpg'),
       (gen_random_uuid(), 'Harbor', 4, 'GREEN', 43, 'http://ciudadelas.net/images/ciudadelas/card27.jpg'),
       (gen_random_uuid(), 'Town Hall', 5, 'GREEN', 44, 'http://ciudadelas.net/images/ciudadelas/card24.jpg'),
       (gen_random_uuid(), 'Town Hall', 5, 'GREEN', 45, 'http://ciudadelas.net/images/ciudadelas/card24.jpg'),
       (gen_random_uuid(), 'Watchtower', 1, 'RED', 46, 'http://ciudadelas.net/images/ciudadelas/card12.jpg'),
       (gen_random_uuid(), 'Watchtower', 1, 'RED', 47, 'http://ciudadelas.net/images/ciudadelas/card12.jpg'),
       (gen_random_uuid(), 'Watchtower', 1, 'RED', 48, 'http://ciudadelas.net/images/ciudadelas/card12.jpg'),
       (gen_random_uuid(), 'Prison', 2, 'RED', 49, 'http://ciudadelas.net/images/ciudadelas/card14.jpg'),
       (gen_random_uuid(), 'Prison', 2, 'RED', 50, 'http://ciudadelas.net/images/ciudadelas/card14.jpg'),
       (gen_random_uuid(), 'Prison', 2, 'RED', 51, 'http://ciudadelas.net/images/ciudadelas/card14.jpg'),
       (gen_random_uuid(), 'Battlefield', 3, 'RED', 52, 'http://ciudadelas.net/images/ciudadelas/card16.jpg'),
       (gen_random_uuid(), 'Battlefield', 3, 'RED', 53, 'http://ciudadelas.net/images/ciudadelas/card16.jpg'),
       (gen_random_uuid(), 'Battlefield', 3, 'RED', 54, 'http://ciudadelas.net/images/ciudadelas/card16.jpg'),
       (gen_random_uuid(), 'Fortress', 5, 'RED', 55, 'http://ciudadelas.net/images/ciudadelas/card17.jpg'),
       (gen_random_uuid(), 'Fortress', 5, 'RED', 56, 'http://ciudadelas.net/images/ciudadelas/card17.jpg'),
       (gen_random_uuid(), 'Fortress', 5, 'RED', 57, 'http://ciudadelas.net/images/ciudadelas/card17.jpg');

-- Achievements
Insert into achievement(id, name, description, number_of_loyalty_points)
values (gen_random_uuid(), 'Pro', 'Won 5 games', 20);
Insert into achievement(id, name, description, number_of_loyalty_points)
values (gen_random_uuid(), 'Expert', 'Won 10 games', 50);
Insert into achievement(id, name, description, number_of_loyalty_points)
values (gen_random_uuid(), 'Speedrunner', 'Finished a game under 10 minutes', 30);
Insert into achievement(id, name, description, number_of_loyalty_points)
values (gen_random_uuid(), 'High roller', 'Received a score higher than 20', 50);
Insert into achievement(id, name, description, number_of_loyalty_points)
values (gen_random_uuid(), 'Addict', 'Played every day for a week', 50);
Insert into achievement(id, name, description, number_of_loyalty_points)
values (gen_random_uuid(), 'Master architect', 'Has built 10 buildings in 1 game', 150);
Insert into achievement(id, name, description, number_of_loyalty_points)
values (gen_random_uuid(), 'Hoarder', 'Has 10 buildings in hand', 30);
Insert into achievement(id, name, description, number_of_loyalty_points)
values (gen_random_uuid(), 'Beginner architect', 'Has built 10 buildings', 20);

-- Gimmicks
Insert into gimmick(id, name, number_of_loyalty_points, type)
values (gen_random_uuid(), 'Green backgroundcolor', 10, 'BACKGROUNDCOLOR');
Insert into gimmick(id, name, number_of_loyalty_points, type)
values (gen_random_uuid(), 'Blue backgroundcolor', 10, 'BACKGROUNDCOLOR');
Insert into gimmick(id, name, number_of_loyalty_points, type)
values (gen_random_uuid(), 'Red backgroundcolor', 10, 'BACKGROUNDCOLOR');
Insert into gimmick(id, name, number_of_loyalty_points, type)
values (gen_random_uuid(), 'Wilhelm scream: assassin', 100, 'SOUND');
Insert into gimmick(id, name, number_of_loyalty_points, type)
values (gen_random_uuid(), 'Royal entrance: king', 100, 'SOUND');
Insert into gimmick(id, name, number_of_loyalty_points, type)
values (gen_random_uuid(), 'Hey!: thief', 100, 'SOUND');
Insert into gimmick(id, name, number_of_loyalty_points, type)
values (gen_random_uuid(), 'Dearly beloved: Bishop', 100, 'SOUND');
Insert into gimmick(id, name, number_of_loyalty_points, type)
values (gen_random_uuid(), 'Building crumbling: Warlord', 100, 'SOUND');
Insert into gimmick(id, name, number_of_loyalty_points, type)
values (gen_random_uuid(), 'Best stuff in town!: Warlord', 100, 'SOUND');
Insert into gimmick(id, name, number_of_loyalty_points, type)
values (gen_random_uuid(), 'Hammers and tools: architect', 100, 'SOUND');
Insert into gimmick(id, name, number_of_loyalty_points, type)
values (gen_random_uuid(), 'Khajit has wares: merchant', 100, 'SOUND');
Insert into gimmick(id, name, number_of_loyalty_points, type)
values (gen_random_uuid(), 'Be amazed: magician', 100, 'SOUND');
Insert into gimmick(id, name, number_of_loyalty_points, type)
values (gen_random_uuid(), 'This is fine', 70, 'AVATAR');
Insert into gimmick(id, name, number_of_loyalty_points, type)
values (gen_random_uuid(), 'Pikachu', 50, 'AVATAR');
Insert into gimmick(id, name, number_of_loyalty_points, type)
values (gen_random_uuid(), 'Jeonghan', 100, 'AVATAR');
Insert into gimmick(id, name, number_of_loyalty_points, type)
values (gen_random_uuid(), 'Grumpy cat', 80, 'AVATAR');
Insert into gimmick(id, name, number_of_loyalty_points, type)
values (gen_random_uuid(), 'Capybara', 50, 'AVATAR');

--Profiles // change these on an individual basis due to keycloak generating UUIDs
Insert into profile(id, user_name, name, number_of_loyalty_points, birthday, channel, avatar_url, locale, email, discord)
values ('2f8e17e0-7450-4f46-865b-d5171f240a1e', 'DrDiabetes', 'Jason Schelfhout', 250, '1998-02-01', 'DISCORD', '', 'nl_BE', 'jason.schelfhout@student.kdg.be', 'trivvoo'),
       ('01a12318-0870-4b74-90e7-e416e3bda897', 'Ghostie', 'Dylan Krans', 50, '2005-03-15', 'MAIL', '', 'en_UK', 'dylan.krans@student.kdg.be', 'trivvoo'),
       ('604c2ee9-a206-4e0a-8114-65d042071a9d', 'Happybebb', 'Hoying Chow', 110, '1999-09-20', 'DISCORD', '/assets/profile/avatars/jeonghan.jpg', 'nl_BE', 'hoying.chow@student.kdg.be', 'trivvoo'),
       ('3b6dfb85-fa46-486c-bf8c-fca97fa80092', 'Iebie', 'Ellen Berckmans', 70, '2002-07-01', 'MAIL', '', 'nl_BE', 'ellen.berckmans@student.kdg.be', 'trivvoo'),
       ('4b1a69c2-5ffc-4345-bf4a-00ebdc615896', 'Ilian', 'Ilian Elst', 200, '2003-11-13', 'MESSAGECENTER', '/assets/profile/avatars/grumpycat.jpg', 'en_UK', 'ilian.elst@student.kdg.be', 'trivvoo'),
       ('614ce6b1-0c84-456c-8bc5-624b3df7e542', 'Frank', 'Tibo De Bast', 230, '1999-05-25', 'MESSAGECENTER', '', 'en_UK', 'tibo.debast@student.kdg.be', 'trivvoo'),
       ('0aa66a30-3608-4afa-b40a-9ad50fc6996c', 'Skye', 'Bryan Cant', 190, '2001-02-01', 'DISCORD', '/assets/profile/avatars/thisisfine.jpg', 'nl_BE','bryan.cant@student.kdg.be', 'trivvoo'),
       ('ee7a5b7b-b57c-45b0-9c0e-bf77426ffef9', 'IMathy', 'Mathias Leys', 30, '2010-12-31', 'DISCORD', '', 'en_UK', 'mathias.leys@student.kdg.be', 'trivvoo'),
       ('b972d785-7490-429f-85e5-e87124495546', 'Mickeyflora', 'Wing Ieong', 140, '2001-05-10', 'MAIL', '', 'en_UK', 'wing.ieong@student.kdg.be', 'trivvoo'),
       ('6c0f7e0d-4d66-4e70-82c0-a5482d0cc2e3', 'FeistyFireFlower', 'Hannah Berckmans', 0, '1992-10-24', 'MAIL', '', 'en_UK', 'hannah.berckmans@student.kdg.be', 'trivvoo'),
       ('dca1714f-5156-49d1-a6b2-d74036f984d9', 'Cissa', 'Cissa Jansens', 90, '1995-03-07', 'MAIL', '', 'en_UK', 'cissa.jansens@student.kdg.be', 'trivvoo'),
       ('dd6e822b-83e0-4c3e-99c8-818ccbb22ff5', 'BusyBuse', 'Buse Mertens', 100, '2001-12-15', 'DISCORD', '', 'en_UK', 'buse.mertens@student.kdg.be', 'trivvoo'),
       ('0a1ef165-6424-4a85-a892-128133fad516', 'Amys', 'Amy McAdams', 270, '1986-04-30', 'MESSAGECENTER', '', 'en_UK', 'amy.mcadams@student.kdg.be', 'trivvoo'),
       ('2496190e-17dc-4fd9-8a54-56757819c6f3', 'Milano', 'Milan Kortinov', 150, '1991-10-14', 'DISCORD', '', 'en_UK', 'milan.kortinov@student.kdg.be', 'trivvoo'),
       ('b11a636a-d3a6-4a09-92f2-5889aba72856', 'Jeroenimal', 'Jeroen Meersschaert', 40, '1992-04-23', 'MAIL', '', 'en_UK', 'jeroen.meersschaert@student.kdg.be', 'trivvoo'),
       ('f294d57b-ddcf-4bd6-8ec7-252e0e322d8c', 'Hacker(wo)man', 'Ilian Meersschaert', 450, '550-04-23', 'DISCORD', '', 'en_UK', 'ilian.coding@carevantage.com', 'trivvoo');

-- Profilefriends
Insert into profile_friends(friends_id, profile_id)
values ((select id from profile where user_name = 'Happybebb'),
        (select id from profile where user_name = 'DrDiabetes')),
       ((select id from profile where user_name = 'Ghostie'), (select id from profile where user_name = 'DrDiabetes')),
       ((select id from profile where user_name = 'Iebie'), (select id from profile where user_name = 'DrDiabetes')),
       ((select id from profile where user_name = 'Mickeyflora'),
        (select id from profile where user_name = 'DrDiabetes')),
       ((select id from profile where user_name = 'Cissa'), (select id from profile where user_name = 'DrDiabetes')),
       ((select id from profile where user_name = 'Milano'), (select id from profile where user_name = 'DrDiabetes')),
       ((select id from profile where user_name = 'FeistyFireFlower'),
        (select id from profile where user_name = 'DrDiabetes')),
       ((select id from profile where user_name = 'Happybebb'),
        (select id from profile where user_name = 'Mickeyflora')),
       ((select id from profile where user_name = 'DrDiabetes'),
        (select id from profile where user_name = 'Mickeyflora')),
       ((select id from profile where user_name = 'Ghostie'), (select id from profile where user_name = 'Mickeyflora')),
       ((select id from profile where user_name = 'Cissa'), (select id from profile where user_name = 'Mickeyflora')),
       ((select id from profile where user_name = 'BusyBuse'),
        (select id from profile where user_name = 'Mickeyflora')),
       ((select id from profile where user_name = 'Ilian'), (select id from profile where user_name = 'Mickeyflora')),
       ((select id from profile where user_name = 'Amys'), (select id from profile where user_name = 'Mickeyflora')),
       ((select id from profile where user_name = 'DrDiabetes'), (select id from profile where user_name = 'Ghostie')),
       ((select id from profile where user_name = 'Happybebb'), (select id from profile where user_name = 'Ghostie')),
       ((select id from profile where user_name = 'Mickeyflora'), (select id from profile where user_name = 'Ghostie')),
       ((select id from profile where user_name = 'Cissa'), (select id from profile where user_name = 'Ghostie')),
       ((select id from profile where user_name = 'Ghostie'), (select id from profile where user_name = 'Happybebb')),
       ((select id from profile where user_name = 'DrDiabetes'),
        (select id from profile where user_name = 'Happybebb')),
       ((select id from profile where user_name = 'Mickeyflora'),
        (select id from profile where user_name = 'Happybebb')),
       ((select id from profile where user_name = 'Iebie'), (select id from profile where user_name = 'Happybebb')),
       ((select id from profile where user_name = 'Ilian'), (select id from profile where user_name = 'Happybebb')),
       ((select id from profile where user_name = 'Frank'), (select id from profile where user_name = 'Happybebb')),
       ((select id from profile where user_name = 'Skye'), (select id from profile where user_name = 'Happybebb')),
       ((select id from profile where user_name = 'IMathy'), (select id from profile where user_name = 'Happybebb')),
       ((select id from profile where user_name = 'IMathy'), (select id from profile where user_name = 'Iebie')),
       ((select id from profile where user_name = 'Happybebb'), (select id from profile where user_name = 'Iebie')),
       ((select id from profile where user_name = 'Frank'), (select id from profile where user_name = 'Iebie')),
       ((select id from profile where user_name = 'Skye'), (select id from profile where user_name = 'Iebie')),
       ((select id from profile where user_name = 'Ilian'), (select id from profile where user_name = 'Iebie')),
       ((select id from profile where user_name = 'DrDiabetes'), (select id from profile where user_name = 'Iebie')),
       ((select id from profile where user_name = 'Mickeyflora'), (select id from profile where user_name = 'Iebie')),
       ((select id from profile where user_name = 'FeistyFireFlower'),
        (select id from profile where user_name = 'Iebie')),
       ((select id from profile where user_name = 'Jeroenimal'), (select id from profile where user_name = 'Iebie')),
       ((select id from profile where user_name = 'Iebie'), (select id from profile where user_name = 'Ilian')),
       ((select id from profile where user_name = 'Happybebb'), (select id from profile where user_name = 'Ilian')),
       ((select id from profile where user_name = 'Skye'), (select id from profile where user_name = 'Ilian')),
       ((select id from profile where user_name = 'Mickeyflora'), (select id from profile where user_name = 'Ilian')),
       ((select id from profile where user_name = 'Frank'), (select id from profile where user_name = 'Ilian')),
       ((select id from profile where user_name = 'IMathy'), (select id from profile where user_name = 'Ilian')),
       ((select id from profile where user_name = 'IMathy'), (select id from profile where user_name = 'Frank')),
       ((select id from profile where user_name = 'Happybebb'), (select id from profile where user_name = 'Frank')),
       ((select id from profile where user_name = 'Iebie'), (select id from profile where user_name = 'Frank')),
       ((select id from profile where user_name = 'Skye'), (select id from profile where user_name = 'Frank')),
       ((select id from profile where user_name = 'Ilian'), (select id from profile where user_name = 'Frank')),
       ((select id from profile where user_name = 'Frank'), (select id from profile where user_name = 'Skye')),
       ((select id from profile where user_name = 'Iebie'), (select id from profile where user_name = 'Skye')),
       ((select id from profile where user_name = 'Happybebb'), (select id from profile where user_name = 'Skye')),
       ((select id from profile where user_name = 'Ilian'), (select id from profile where user_name = 'Skye')),
       ((select id from profile where user_name = 'IMathy'), (select id from profile where user_name = 'Skye')),
       ((select id from profile where user_name = 'Frank'), (select id from profile where user_name = 'IMathy')),
       ((select id from profile where user_name = 'Skye'), (select id from profile where user_name = 'IMathy')),
       ((select id from profile where user_name = 'Happybebb'), (select id from profile where user_name = 'IMathy')),
       ((select id from profile where user_name = 'Ilian'), (select id from profile where user_name = 'IMathy')),
       ((select id from profile where user_name = 'Iebie'), (select id from profile where user_name = 'IMathy')),
       ((select id from profile where user_name = 'Iebie'),
        (select id from profile where user_name = 'FeistyFireFlower')),
       ((select id from profile where user_name = 'Jeroenimal'),
        (select id from profile where user_name = 'FeistyFireFlower')),
       ((select id from profile where user_name = 'DrDiabetes'),
        (select id from profile where user_name = 'FeistyFireFlower')),
       ((select id from profile where user_name = 'DrDiabetes'), (select id from profile where user_name = 'Cissa')),
       ((select id from profile where user_name = 'Amys'), (select id from profile where user_name = 'Cissa')),
       ((select id from profile where user_name = 'Mickeyflora'), (select id from profile where user_name = 'Cissa')),
       ((select id from profile where user_name = 'Happybebb'), (select id from profile where user_name = 'Cissa')),
       ((select id from profile where user_name = 'Ghostie'), (select id from profile where user_name = 'Cissa')),
       ((select id from profile where user_name = 'BusyBuse'), (select id from profile where user_name = 'Cissa')),
       ((select id from profile where user_name = 'Mickeyflora'),
        (select id from profile where user_name = 'BusyBuse')),
       ((select id from profile where user_name = 'Amys'), (select id from profile where user_name = 'BusyBuse')),
       ((select id from profile where user_name = 'Cissa'), (select id from profile where user_name = 'BusyBuse')),
       ((select id from profile where user_name = 'Cissa'), (select id from profile where user_name = 'Amys')),
       ((select id from profile where user_name = 'BusyBuse'), (select id from profile where user_name = 'Amys')),
       ((select id from profile where user_name = 'Mickeyflora'), (select id from profile where user_name = 'Amys')),
       ((select id from profile where user_name = 'DrDiabetes'), (select id from profile where user_name = 'Milano')),
       ((select id from profile where user_name = 'DrDiabetes'),
        (select id from profile where user_name = 'Jeroenimal')),
       ((select id from profile where user_name = 'Iebie'), (select id from profile where user_name = 'Jeroenimal')),
       ((select id from profile where user_name = 'FeistyFireFlower'),
        (select id from profile where user_name = 'Jeroenimal'));

-- Profileachievements
Insert into profile_achievements(achievements_id, profile_id)
values ((select id from achievement where description = 'Won 5 games'),
        (select id from profile where user_name = 'DrDiabetes')),
       ((select id from achievement where description = 'Has built 10 buildings in 1 game'),
        (select id from profile where user_name = 'DrDiabetes')),
       ((select id from achievement where description = 'Has 10 buildings in hand'),
        (select id from profile where user_name = 'Ghostie')),
       ((select id from achievement where description = 'Has built 10 buildings'),
        (select id from profile where user_name = 'Ghostie')),
       ((select id from achievement where description = 'Played every day for a week'),
        (select id from profile where user_name = 'Happybebb')),
       ((select id from achievement where description = 'Finished a game under 10 minutes'),
        (select id from profile where user_name = 'Happybebb')),
       ((select id from achievement where description = 'Won 10 games'),
        (select id from profile where user_name = 'Iebie')),
       ((select id from achievement where description = 'Won 5 games'),
        (select id from profile where user_name = 'Iebie')),
       ((select id from achievement where description = 'Has built 10 buildings'),
        (select id from profile where user_name = 'Ilian')),
       ((select id from achievement where description = 'Has built 10 buildings in 1 game'),
        (select id from profile where user_name = 'Frank')),
       ((select id from achievement where description = 'Received a score higher than 20'),
        (select id from profile where user_name = 'Frank')),
       ((select id from achievement where description = 'Has built 10 buildings'),
        (select id from profile where user_name = 'Skye')),
       ((select id from achievement where description = 'Won 5 games'),
        (select id from profile where user_name = 'Skye')),
       ((select id from achievement where description = 'Won 10 games'),
        (select id from profile where user_name = 'Skye')),
       ((select id from achievement where description = 'Played every day for a week'),
        (select id from profile where user_name = 'Skye')),
       ((select id from achievement where description = 'Has built 10 buildings'),
        (select id from profile where user_name = 'Mickeyflora')),
       ((select id from achievement where description = 'Won 5 games'),
        (select id from profile where user_name = 'Mickeyflora')),
       ((select id from achievement where description = 'Played every day for a week'),
        (select id from profile where user_name = 'Mickeyflora')),
       ((select id from achievement where description = 'Won 10 games'),
        (select id from profile where user_name = 'Mickeyflora')),
       ((select id from achievement where description = 'Won 10 games'),
        (select id from profile where user_name = 'Cissa')),
       ((select id from achievement where description = 'Won 5 games'),
        (select id from profile where user_name = 'Cissa')),
       ((select id from achievement where description = 'Has built 10 buildings'),
        (select id from profile where user_name = 'Cissa')),
       ((select id from achievement where description = 'Received a score higher than 20'),
        (select id from profile where user_name = 'BusyBuse')),
       ((select id from achievement where description = 'Has built 10 buildings in 1 game'),
        (select id from profile where user_name = 'Amys')),
       ((select id from achievement where description = 'Won 5 games'),
        (select id from profile where user_name = 'Amys')),
       ((select id from achievement where description = 'Won 10 games'),
        (select id from profile where user_name = 'Amys')),
       ((select id from achievement where description = 'Played every day for a week'),
        (select id from profile where user_name = 'Amys')),
       ((select id from achievement where description = 'Received a score higher than 20'),
        (select id from profile where user_name = 'Milano')),
       ((select id from achievement where description = 'Has 10 buildings in hand'),
        (select id from profile where user_name = 'Milano')),
       ((select id from achievement where description = 'Has built 10 buildings'),
        (select id from profile where user_name = 'Milano')),
       ((select id from achievement where description = 'Has built 10 buildings'),
        (select id from profile where user_name = 'Jeroenimal')),
       ((select id from achievement where description = 'Won 5 games'),
        (select id from profile where user_name = 'Jeroenimal'));

-- ProfileGimmick
Insert into profile_gimmicks(gimmicks_id, profile_id)
values ((select id from gimmick where name = 'Green backgroundcolor'),
        (select id from profile where user_name = 'DrDiabetes')),
       ((select id from gimmick where name = 'Grumpy cat'), (select id from profile where user_name = 'DrDiabetes')),
       ((select id from gimmick where name = 'Grumpy cat'), (select id from profile where user_name = 'Skye')),
       ((select id from gimmick where name = 'Red backgroundcolor'),
        (select id from profile where user_name = 'DrDiabetes')),
       ((select id from gimmick where name = 'Wilhelm scream: assassin'),
        (select id from profile where user_name = 'Ghostie')),
       ((select id from gimmick where name = 'Wilhelm scream: assassin'),
        (select id from profile where user_name = 'Skye')),
       ((select id from gimmick where name = 'Royal entrance: king'),
        (select id from profile where user_name = 'Happybebb')),
       ((select id from gimmick where name = 'Hey!: thief'), (select id from profile where user_name = 'Iebie')),
       ((select id from gimmick where name = 'Hey!: thief'), (select id from profile where user_name = 'Skye')),
       ((select id from gimmick where name = 'Dearly beloved: Bishop'),
        (select id from profile where user_name = 'Ilian')),
       ((select id from gimmick where name = 'Building crumbling: Warlord'),
        (select id from profile where user_name = 'Frank')),
       ((select id from gimmick where name = 'Khajit has wares: merchant'),
        (select id from profile where user_name = 'Skye')),
       ((select id from gimmick where name = 'Hammers and tools: architect'),
        (select id from profile where user_name = 'IMathy')),
       ((select id from gimmick where name = 'Be amazed: magician'),
        (select id from profile where user_name = 'Mickeyflora')),
       ((select id from gimmick where name = 'This is fine'),
        (select id from profile where user_name = 'FeistyFireFlower')),
       ((select id from gimmick where name = 'This is fine'), (select id from profile where user_name = 'Skye')),
       ((select id from gimmick where name = 'Green backgroundcolor'),
        (select id from profile where user_name = 'FeistyFireFlower')),
       ((select id from gimmick where name = 'Red backgroundcolor'),
        (select id from profile where user_name = 'FeistyFireFlower')),
       ((select id from gimmick where name = 'Blue backgroundcolor'),
        (select id from profile where user_name = 'FeistyFireFlower')),
       ((select id from gimmick where name = 'Green backgroundcolor'),
        (select id from profile where user_name = 'Skye')),
       ((select id from gimmick where name = 'Red backgroundcolor'), (select id from profile where user_name = 'Skye')),
       ((select id from gimmick where name = 'Blue backgroundcolor'),
        (select id from profile where user_name = 'Skye')),
       ((select id from gimmick where name = 'Pikachu'), (select id from profile where user_name = 'Cissa')),
       ((select id from gimmick where name = 'Pikachu'), (select id from profile where user_name = 'Skye')),
       ((select id from gimmick where name = 'Capybara'), (select id from profile where user_name = 'BusyBuse')),
       ((select id from gimmick where name = 'Jeonghan'), (select id from profile where user_name = 'Amys')),
       ((select id from gimmick where name = 'Jeonghan'), (select id from profile where user_name = 'Skye')),
       ((select id from gimmick where name = 'Dearly beloved: Bishop'),
        (select id from profile where user_name = 'Milano')),
       ((select id from gimmick where name = 'Royal entrance: king'),
        (select id from profile where user_name = 'Jeroenimal'));

-- Lobby
Insert into lobby(id, open, number, average_loyalty_points)
values ('89b80749-a4a0-478a-b658-edfd8b5ecd84', false, 1, 50),
       ('08a0bb94-8425-4f61-b9aa-6bd3adb3912a', false, 2, 10),
       ('07ff9d70-e867-4848-81fb-1825cb651a79', false, 3, 150),
       (gen_random_uuid(), false, 4, 30),
       ('233e194c-f5da-4f7c-92b7-4b44f3641598', false, 5, 110),
       (gen_random_uuid(), false, 6, 70),
       (gen_random_uuid(), false, 7, 100),
       (gen_random_uuid(), true, 8, 50),
       (gen_random_uuid(), true, 9, 10),
       (gen_random_uuid(), true, 10, 0),
       (gen_random_uuid(), true, 11, 80),
       (gen_random_uuid(), true, 12, 30),
       (gen_random_uuid(), true, 13, 60);

-- Lobbyprofiles
Insert into lobby_profiles(lobby_id, profiles_id)
VALUES ((select id from lobby where number = 1), (select id from profile where user_name = 'DrDiabetes')),
       ((select id from lobby where number = 1), (select id from profile where user_name = 'Happybebb')),
       ((select id from lobby where number = 1), (select id from profile where user_name = 'Ghostie')),
       ((select id from lobby where number = 2), (select id from profile where user_name = 'Iebie')),
       ((select id from lobby where number = 2), (select id from profile where user_name = 'Ilian')),
       ((select id from lobby where number = 2), (select id from profile where user_name = 'Happybebb')),
       ((select id from lobby where number = 2), (select id from profile where user_name = 'Skye')),
       ((select id from lobby where number = 2), (select id from profile where user_name = 'IMathy')),
       ((select id from lobby where number = 2), (select id from profile where user_name = 'Frank')),
       ((select id from lobby where number = 3), (select id from profile where user_name = 'Mickeyflora')),
       ((select id from lobby where number = 3), (select id from profile where user_name = 'Cissa')),
       ((select id from lobby where number = 3), (select id from profile where user_name = 'BusyBuse')),
       ((select id from lobby where number = 3), (select id from profile where user_name = 'Happybebb')),
       ((select id from lobby where number = 3), (select id from profile where user_name = 'Amys')),
       ((select id from lobby where number = 4), (select id from profile where user_name = 'DrDiabetes')),
       ((select id from lobby where number = 4), (select id from profile where user_name = 'Milano')),
       ((select id from lobby where number = 4), (select id from profile where user_name = 'Jeroenimal')),
       ((select id from lobby where number = 5), (select id from profile where user_name = 'DrDiabetes')),
       ((select id from lobby where number = 5), (select id from profile where user_name = 'Jeroenimal')),
       ((select id from lobby where number = 5), (select id from profile where user_name = 'Iebie')),
       ((select id from lobby where number = 5), (select id from profile where user_name = 'FeistyFireFlower')),
       ((select id from lobby where number = 6), (select id from profile where user_name = 'Iebie')),
       ((select id from lobby where number = 6), (select id from profile where user_name = 'Happybebb')),
       ((select id from lobby where number = 6), (select id from profile where user_name = 'Ilian')),
       ((select id from lobby where number = 6), (select id from profile where user_name = 'Frank')),
       ((select id from lobby where number = 6), (select id from profile where user_name = 'Skye')),
       ((select id from lobby where number = 6), (select id from profile where user_name = 'IMathy')),
       ((select id from lobby where number = 7), (select id from profile where user_name = 'Cissa')),
       ((select id from lobby where number = 7), (select id from profile where user_name = 'DrDiabetes')),
       ((select id from lobby where number = 7), (select id from profile where user_name = 'Happybebb')),
       ((select id from lobby where number = 7), (select id from profile where user_name = 'Mickeyflora')),
       ((select id from lobby where number = 7), (select id from profile where user_name = 'Ghostie')),
       ((select id from lobby where number = 7), (select id from profile where user_name = 'Iebie')),
       ((select id from lobby where number = 7), (select id from profile where user_name = 'FeistyFireFlower')),
       ((select id from lobby where number = 8), (select id from profile where user_name = 'FeistyFireFlower')),
       ((select id from lobby where number = 8), (select id from profile where user_name = 'Iebie')),
       ((select id from lobby where number = 9), (select id from profile where user_name = 'IMathy')),
       ((select id from lobby where number = 10), (select id from profile where user_name = 'Cissa')),
       ((select id from lobby where number = 10), (select id from profile where user_name = 'Amys')),
       ((select id from lobby where number = 10), (select id from profile where user_name = 'Happybebb')),
       ((select id from lobby where number = 10), (select id from profile where user_name = 'Mickeyflora')),
       ((select id from lobby where number = 10), (select id from profile where user_name = 'BusyBuse')),
       ((select id from lobby where number = 11), (select id from profile where user_name = 'FeistyFireFlower')),
       ((select id from lobby where number = 11), (select id from profile where user_name = 'Jeroenimal')),
       ((select id from lobby where number = 11), (select id from profile where user_name = 'Milano')),
       ((select id from lobby where number = 11), (select id from profile where user_name = 'DrDiabetes')),
       ((select id from lobby where number = 12), (select id from profile where user_name = 'Frank')),
       ((select id from lobby where number = 12), (select id from profile where user_name = 'Skye')),
       ((select id from lobby where number = 12), (select id from profile where user_name = 'Ilian')),
       ((select id from lobby where number = 13), (select id from profile where user_name = 'IMathy'));

-- Players
Insert into player (id, profile_id, number)
values ('22cca2c4-babf-4364-af26-5a9e1bb52510', (select id from profile where user_name = 'DrDiabetes'), 1),
       ('ad2ae146-a2b3-4ee7-ac02-6af2e081b2c1', (select id from profile where user_name = 'Happybebb'), 2),
       (gen_random_uuid(), (select id from profile where user_name = 'Ghostie'), 3),
       (gen_random_uuid(), (select id from profile where user_name = 'Iebie'), 4),
       ('9c1e99cc-70f2-4cb2-9800-464d5781f47e', (select id from profile where user_name = 'Ilian'), 5),
       (gen_random_uuid(), (select id from profile where user_name = 'Happybebb'), 6),
       (gen_random_uuid(), (select id from profile where user_name = 'Skye'), 7),
       (gen_random_uuid(), (select id from profile where user_name = 'IMathy'), 8),
       ('ff6bb83f-f5ff-457c-a45f-69fb8b333e11', (select id from profile where user_name = 'Frank'), 9),
       (gen_random_uuid(), (select id from profile where user_name = 'Mickeyflora'), 10),
       (gen_random_uuid(), (select id from profile where user_name = 'Cissa'), 11),
       (gen_random_uuid(), (select id from profile where user_name = 'BusyBuse'), 12),
       (gen_random_uuid(), (select id from profile where user_name = 'Happybebb'), 13),
       (gen_random_uuid(), (select id from profile where user_name = 'Amys'), 14),
       (gen_random_uuid(), (select id from profile where user_name = 'DrDiabetes'), 15),
       (gen_random_uuid(), (select id from profile where user_name = 'Milano'), 16),
       (gen_random_uuid(), (select id from profile where user_name = 'Jeroenimal'), 17),
       (gen_random_uuid(), (select id from profile where user_name = 'DrDiabetes'), 18),
       (gen_random_uuid(), (select id from profile where user_name = 'Jeroenimal'), 19),
       (gen_random_uuid(), (select id from profile where user_name = 'Iebie'), 20),
       (gen_random_uuid(), (select id from profile where user_name = 'FeistyFireFlower'), 21),
       (gen_random_uuid(), (select id from profile where user_name = 'Iebie'), 22),
       (gen_random_uuid(), (select id from profile where user_name = 'Happybebb'), 23),
       (gen_random_uuid(), (select id from profile where user_name = 'Ilian'), 24),
       (gen_random_uuid(), (select id from profile where user_name = 'Frank'), 25),
       (gen_random_uuid(), (select id from profile where user_name = 'Skye'), 26),
       (gen_random_uuid(), (select id from profile where user_name = 'IMathy'), 27),
       (gen_random_uuid(), (select id from profile where user_name = 'Cissa'), 28),
       (gen_random_uuid(), (select id from profile where user_name = 'DrDiabetes'), 29),
       (gen_random_uuid(), (select id from profile where user_name = 'Happybebb'), 30),
       (gen_random_uuid(), (select id from profile where user_name = 'Mickeyflora'), 31),
       (gen_random_uuid(), (select id from profile where user_name = 'Ghostie'), 32),
       (gen_random_uuid(), (select id from profile where user_name = 'Iebie'), 33),
       (gen_random_uuid(), (select id from profile where user_name = 'FeistyFireFlower'), 34),
       (gen_random_uuid(), (select id from profile where user_name = 'Mickeyflora'), 35),
       (gen_random_uuid(), (select id from profile where user_name = 'Cissa'), 36),
       (gen_random_uuid(), (select id from profile where user_name = 'BusyBuse'), 37),
       (gen_random_uuid(), (select id from profile where user_name = 'Happybebb'), 38),
       (gen_random_uuid(), (select id from profile where user_name = 'Amys'), 39),
       (gen_random_uuid(), (select id from profile where user_name = 'Iebie'), 40),
       (gen_random_uuid(), (select id from profile where user_name = 'Happybebb'), 41),
       (gen_random_uuid(), (select id from profile where user_name = 'IMathy'), 42),
       (gen_random_uuid(), (select id from profile where user_name = 'Ilian'), 43),
       (gen_random_uuid(), (select id from profile where user_name = 'Frank'), 44),
       (gen_random_uuid(), (select id from profile where user_name = 'Skye'), 45);

-- PlayerState
Insert into player_state(id, number_of_coins, score, is_king, player_id, number, assassinated, first_to_eight_buildings,
                         has_eight_or_more_buildings)
values (gen_random_uuid(), 9, 20, true, (select id from player where number = 1), 1, true, true, true),
       (gen_random_uuid(), 3, 15, false, (select id from player where number = 2), 2, false, false, true),
       (gen_random_uuid(), 3, 13, false, (select id from player where number = 3), 3, false, false, false),
       (gen_random_uuid(), 1, 10, false, (select id from player where number = 4), 4, false, false, true),
       (gen_random_uuid(), 3, 11, true, (select id from player where number = 5), 5, true, false, false),
       (gen_random_uuid(), 1, 18, false, (select id from player where number = 6), 6, false, false, true),
       (gen_random_uuid(), 2, 24, false, (select id from player where number = 7), 7, false, true, true),
       (gen_random_uuid(), 1, 22, false, (select id from player where number = 8), 8, false, false, false),
       (gen_random_uuid(), 1, 23, false, (select id from player where number = 9), 9, false, false, false),
       (gen_random_uuid(), 5, 14, false, (select id from player where number = 10), 10, false, false, false),
       (gen_random_uuid(), 4, 21, false, (select id from player where number = 11), 11, false, true, true),
       (gen_random_uuid(), 5, 16, false, (select id from player where number = 12), 12, false, false, true),
       (gen_random_uuid(), 6, 20, true, (select id from player where number = 13), 13, false, false, true),
       (gen_random_uuid(), 2, 11, false, (select id from player where number = 14), 14, true, false, false),
       (gen_random_uuid(), 3, 0, true, (select id from player where number = 35), 35, false, false, false),
       (gen_random_uuid(), 3, 0, false, (select id from player where number = 36), 36, false, false, false),
       (gen_random_uuid(), 3, 0, false, (select id from player where number = 37), 37, false, false, false),
       (gen_random_uuid(), 3, 0, false, (select id from player where number = 38), 38, false, false, false),
       (gen_random_uuid(), 3, 0, false, (select id from player where number = 39), 39, false, false, false),
       (gen_random_uuid(), 3, 0, false, (select id from player where number = 15), 15, false, false, false),
       (gen_random_uuid(), 1, 0, true, (select id from player where number = 16), 16, false, false, false),
       (gen_random_uuid(), 0, 0, false, (select id from player where number = 17), 17, false, false, false),
       (gen_random_uuid(), 7, 0, false, (select id from player where number = 18), 18, false, false, false),
       (gen_random_uuid(), 8, 0, false, (select id from player where number = 19), 19, false, false, false),
       (gen_random_uuid(), 5, 0, false, (select id from player where number = 20), 20, false, false, false),
       (gen_random_uuid(), 3, 0, true, (select id from player where number = 21), 21, false, false, false),
       (gen_random_uuid(), 0, 0, false, (select id from player where number = 22), 22, true, false, false),
       (gen_random_uuid(), 6, 0, false, (select id from player where number = 23), 23, false, false, false),
       (gen_random_uuid(), 2, 0, false, (select id from player where number = 24), 24, false, false, false),
       (gen_random_uuid(), 1, 0, true, (select id from player where number = 25), 25, false, false, false),
       (gen_random_uuid(), 9, 0, false, (select id from player where number = 26), 26, false, false, false),
       (gen_random_uuid(), 2, 0, false, (select id from player where number = 27), 27, false, false, false),
       (gen_random_uuid(), 2, 0, false, (select id from player where number = 28), 28, false, false, false),
       (gen_random_uuid(), 0, 0, false, (select id from player where number = 29), 29, false, false, false),
       (gen_random_uuid(), 1, 0, false, (select id from player where number = 30), 30, true, false, false),
       (gen_random_uuid(), 0, 0, true, (select id from player where number = 31), 31, false, false, false),
       (gen_random_uuid(), 0, 0, false, (select id from player where number = 32), 32, false, false, false),
       (gen_random_uuid(), 2, 0, false, (select id from player where number = 33), 33, false, false, false),
       (gen_random_uuid(), 2, 0, false, (select id from player where number = 34), 34, false, false, false),

       (gen_random_uuid(), 0, 0, false, (select id from player where number = 40), 40, false, false, false),
       (gen_random_uuid(), 0, 0, false, (select id from player where number = 41), 41, false, false, false),
       (gen_random_uuid(), 0, 0, false, (select id from player where number = 42), 42, false, false, false),
       (gen_random_uuid(), 0, 0, false, (select id from player where number = 43), 43, false, false, false),
       (gen_random_uuid(), 0, 0, false, (select id from player where number = 44), 44, false, false, false),
       (gen_random_uuid(), 0, 0, false, (select id from player where number = 45), 45, false, false, false);


-- Game
Insert into game(id, number_of_rounds, coins_in_bank, start_time, end_time, turn_duration, completed, winner_id,
                 lobby_id)
values ('578f670e-f352-4254-849d-300075943b31', 1, 2, '2009-04-02 14:09:06', '2009-04-02 16:45:12', 5, true,
        (select id from player where number = 1), (select id from lobby where number = 1)),
       ('d5790ad6-9335-4603-bff2-a925e6a1de80', 2, 21, '2023-12-18 09:13:24', '2023-12-18 13:52:59', 25, true,
        (select id from player where number = 7), (select id from lobby where number = 2)),
       ('1b9ab9e6-8a3b-401f-8255-51bbcf254b7f', 1, 8, '2024-11-23 23:58:12', '2024-11-24 00:02:34', 100, true,
        (select id from player where number = 11), (select id from lobby where number = 3)),
       ('cb89f3c6-e4d1-4862-a62e-416311623522', 3, 15, '2024-11-24 01:34:27', null, 40, false, null,
        (select id from lobby where number = 3)),
       ('046c525a-2161-47f3-83a3-288b4200ed67', 1, 26, '2024-12-01 19:43:02', null, 10, false, null,
        (select id from lobby where number = 4)),
       ('4ac8438b-fbf9-4472-9574-d78d02367548', 2, 7, '2024-12-02 13:42:02', null, 10, false, null,
        (select id from lobby where number = 5)),
       ('d16a4438-949a-4d13-ad48-5f72dd19223b', 1, 19, '2024-11-30 17:29:56', null, 10, false, null,
        (select id from lobby where number = 6)),
       ('efcf8b41-82f7-480f-b086-37947ddfe9eb', 1, 23, '2024-12-01 03:29:47', null, 10, false, null,
        (select id from lobby where number = 7)),
       ('4db1d9a8-c5e8-4db3-ad4f-db979e793bc4', 0, 30, '2024-11-01 14:29:54', null, 10, false, null,
        (select id from lobby where number = 2));

-- BuildingDeck
INSERT INTO building_deck (id)
VALUES ('3787cf6f-e6e9-4f7c-8b90-bd91f32c89f0');


UPDATE game
SET building_deck_id = '3787cf6f-e6e9-4f7c-8b90-bd91f32c89f0'
WHERE id = 'd16a4438-949a-4d13-ad48-5f72dd19223b';

-- Insert Buildings into the new BuildingDeck
INSERT INTO building_deck_buildings (building_deck_id, buildings_id)
SELECT '3787cf6f-e6e9-4f7c-8b90-bd91f32c89f0', id
FROM building;


-- Game players
Insert into game_player_states(game_id, player_states_id)
values ((select id from game where coins_in_bank = 2), (select id from player_state where number = 1)),
       ((select id from game where coins_in_bank = 2), (select id from player_state where number = 2)),
       ((select id from game where coins_in_bank = 2), (select id from player_state where number = 3)),
       ((select id from game where coins_in_bank = 21), (select id from player_state where number = 4)),
       ((select id from game where coins_in_bank = 21), (select id from player_state where number = 5)),
       ((select id from game where coins_in_bank = 21), (select id from player_state where number = 6)),
       ((select id from game where coins_in_bank = 21), (select id from player_state where number = 7)),
       ((select id from game where coins_in_bank = 21), (select id from player_state where number = 8)),
       ((select id from game where coins_in_bank = 21), (select id from player_state where number = 9)),
       ((select id from game where coins_in_bank = 8), (select id from player_state where number = 10)),
       ((select id from game where coins_in_bank = 8), (select id from player_state where number = 11)),
       ((select id from game where coins_in_bank = 8), (select id from player_state where number = 12)),
       ((select id from game where coins_in_bank = 8), (select id from player_state where number = 13)),
       ((select id from game where coins_in_bank = 8), (select id from player_state where number = 14)),
       ((select id from game where coins_in_bank = 15), (select id from player_state where number = 35)),
       ((select id from game where coins_in_bank = 15), (select id from player_state where number = 36)),
       ((select id from game where coins_in_bank = 15), (select id from player_state where number = 37)),
       ((select id from game where coins_in_bank = 15), (select id from player_state where number = 38)),
       ((select id from game where coins_in_bank = 15), (select id from player_state where number = 39)),
       ((select id from game where coins_in_bank = 26), (select id from player_state where number = 15)),
       ((select id from game where coins_in_bank = 26), (select id from player_state where number = 16)),
       ((select id from game where coins_in_bank = 26), (select id from player_state where number = 17)),
       ((select id from game where coins_in_bank = 7), (select id from player_state where number = 18)),
       ((select id from game where coins_in_bank = 7), (select id from player_state where number = 19)),
       ((select id from game where coins_in_bank = 7), (select id from player_state where number = 20)),
       ((select id from game where coins_in_bank = 7), (select id from player_state where number = 21)),
       ((select id from game where coins_in_bank = 19), (select id from player_state where number = 22)),
       ((select id from game where coins_in_bank = 19), (select id from player_state where number = 23)),
       ((select id from game where coins_in_bank = 19), (select id from player_state where number = 24)),
       ((select id from game where coins_in_bank = 19), (select id from player_state where number = 25)),
       ((select id from game where coins_in_bank = 19), (select id from player_state where number = 26)),
       ((select id from game where coins_in_bank = 19), (select id from player_state where number = 27)),
       ((select id from game where coins_in_bank = 23), (select id from player_state where number = 28)),
       ((select id from game where coins_in_bank = 23), (select id from player_state where number = 29)),
       ((select id from game where coins_in_bank = 23), (select id from player_state where number = 30)),
       ((select id from game where coins_in_bank = 23), (select id from player_state where number = 31)),
       ((select id from game where coins_in_bank = 23), (select id from player_state where number = 32)),
       ((select id from game where coins_in_bank = 23), (select id from player_state where number = 33)),
       ((select id from game where coins_in_bank = 23), (select id from player_state where number = 34)),
       ((select id from game where coins_in_bank = 30), (select id from player_state where number = 40)),
       ((select id from game where coins_in_bank = 30), (select id from player_state where number = 41)),
       ((select id from game where coins_in_bank = 30), (select id from player_state where number = 42)),
       ((select id from game where coins_in_bank = 30), (select id from player_state where number = 43)),
       ((select id from game where coins_in_bank = 30), (select id from player_state where number = 44)),
       ((select id from game where coins_in_bank = 30), (select id from player_state where number = 45));

-- PlayerstateBuiltBuildings
Insert into player_state_buildings_built (buildings_built_id, player_state_id)
values ((select id from building where number = 1), (select id from player_state where number = 1)),
       ((select id from building where number = 54), (select id from player_state where number = 1)),
       ((select id from building where number = 32), (select id from player_state where number = 1)),
       ((select id from building where number = 12), (select id from player_state where number = 1)),
       ((select id from building where number = 25), (select id from player_state where number = 1)),
       ((select id from building where number = 55), (select id from player_state where number = 1)),
       ((select id from building where number = 47), (select id from player_state where number = 1)),
       ((select id from building where number = 3), (select id from player_state where number = 1)),
       ((select id from building where number = 34), (select id from player_state where number = 2)),
       ((select id from building where number = 2), (select id from player_state where number = 2)),
       ((select id from building where number = 53), (select id from player_state where number = 2)),
       ((select id from building where number = 26), (select id from player_state where number = 3)),
       ((select id from building where number = 35), (select id from player_state where number = 3)),

       ((select id from building where number = 12), (select id from player_state where number = 4)),
       ((select id from building where number = 4), (select id from player_state where number = 4)),
       ((select id from building where number = 54), (select id from player_state where number = 5)),
       ((select id from building where number = 32), (select id from player_state where number = 5)),
       ((select id from building where number = 35), (select id from player_state where number = 6)),
       ((select id from building where number = 13), (select id from player_state where number = 7)),
       ((select id from building where number = 6), (select id from player_state where number = 7)),
       ((select id from building where number = 43), (select id from player_state where number = 7)),
       ((select id from building where number = 21), (select id from player_state where number = 7)),
       ((select id from building where number = 36), (select id from player_state where number = 7)),
       ((select id from building where number = 42), (select id from player_state where number = 7)),
       ((select id from building where number = 25), (select id from player_state where number = 7)),
       ((select id from building where number = 2), (select id from player_state where number = 7)),
       ((select id from building where number = 15), (select id from player_state where number = 8)),
       ((select id from building where number = 26), (select id from player_state where number = 9)),

       ((select id from building where number = 1), (select id from player_state where number = 10)),
       ((select id from building where number = 35), (select id from player_state where number = 11)),
       ((select id from building where number = 23), (select id from player_state where number = 11)),
       ((select id from building where number = 24), (select id from player_state where number = 11)),
       ((select id from building where number = 12), (select id from player_state where number = 11)),
       ((select id from building where number = 48), (select id from player_state where number = 11)),
       ((select id from building where number = 56), (select id from player_state where number = 11)),
       ((select id from building where number = 14), (select id from player_state where number = 11)),
       ((select id from building where number = 43), (select id from player_state where number = 11)),
       ((select id from building where number = 3), (select id from player_state where number = 12)),
       ((select id from building where number = 6), (select id from player_state where number = 12)),
       ((select id from building where number = 36), (select id from player_state where number = 13)),
       ((select id from building where number = 41), (select id from player_state where number = 14)),

       ((select id from building where number = 1), (select id from player_state where number = 35)),
       ((select id from building where number = 43), (select id from player_state where number = 35)),
       ((select id from building where number = 35), (select id from player_state where number = 35)),
       ((select id from building where number = 27), (select id from player_state where number = 36)),
       ((select id from building where number = 18), (select id from player_state where number = 37)),
       ((select id from building where number = 19), (select id from player_state where number = 37)),
       ((select id from building where number = 30), (select id from player_state where number = 38)),
       ((select id from building where number = 50), (select id from player_state where number = 39)),

       ((select id from building where number = 10), (select id from player_state where number = 15)),
       ((select id from building where number = 29), (select id from player_state where number = 16)),
       ((select id from building where number = 32), (select id from player_state where number = 16)),
       ((select id from building where number = 55), (select id from player_state where number = 16)),
       ((select id from building where number = 43), (select id from player_state where number = 17)),

       ((select id from building where number = 1), (select id from player_state where number = 18)),
       ((select id from building where number = 12), (select id from player_state where number = 18)),
       ((select id from building where number = 34), (select id from player_state where number = 18)),
       ((select id from building where number = 28), (select id from player_state where number = 19)),
       ((select id from building where number = 53), (select id from player_state where number = 19)),
       ((select id from building where number = 21), (select id from player_state where number = 19)),
       ((select id from building where number = 30), (select id from player_state where number = 20)),
       ((select id from building where number = 47), (select id from player_state where number = 20)),
       ((select id from building where number = 9), (select id from player_state where number = 21)),

       ((select id from building where number = 4), (select id from player_state where number = 22)),
       ((select id from building where number = 15), (select id from player_state where number = 23)),
       ((select id from building where number = 24), (select id from player_state where number = 23)),
       ((select id from building where number = 37), (select id from player_state where number = 24)),
       ((select id from building where number = 42), (select id from player_state where number = 25)),
       ((select id from building where number = 53), (select id from player_state where number = 25)),
       ((select id from building where number = 10), (select id from player_state where number = 25)),
       ((select id from building where number = 20), (select id from player_state where number = 25)),
       ((select id from building where number = 30), (select id from player_state where number = 26)),
       ((select id from building where number = 40), (select id from player_state where number = 26)),
       ((select id from building where number = 50), (select id from player_state where number = 26)),
       ((select id from building where number = 49), (select id from player_state where number = 27)),

       ((select id from building where number = 2), (select id from player_state where number = 28)),
       ((select id from building where number = 11), (select id from player_state where number = 28)),
       ((select id from building where number = 26), (select id from player_state where number = 28)),
       ((select id from building where number = 35), (select id from player_state where number = 29)),
       ((select id from building where number = 17), (select id from player_state where number = 29)),
       ((select id from building where number = 47), (select id from player_state where number = 30)),
       ((select id from building where number = 55), (select id from player_state where number = 31)),
       ((select id from building where number = 4), (select id from player_state where number = 31)),
       ((select id from building where number = 25), (select id from player_state where number = 31)),
       ((select id from building where number = 51), (select id from player_state where number = 32)),
       ((select id from building where number = 32), (select id from player_state where number = 33)),
       ((select id from building where number = 20), (select id from player_state where number = 33)),
       ((select id from building where number = 40), (select id from player_state where number = 33)),
       ((select id from building where number = 41), (select id from player_state where number = 34))
;


-- PlayerstateBuildingsinhand
Insert into player_state_buildings_in_hand(buildings_in_hand_id, player_state_id)
values ((select id from building where number = 6), (select id from player_state where number = 1)),
       ((select id from building where number = 13), (select id from player_state where number = 2)),
       ((select id from building where number = 54), (select id from player_state where number = 2)),
       ((select id from building where number = 33), (select id from player_state where number = 2)),
       ((select id from building where number = 45), (select id from player_state where number = 3)),
       ((select id from building where number = 6), (select id from player_state where number = 3)),

       ((select id from building where number = 1), (select id from player_state where number = 4)),
       ((select id from building where number = 39), (select id from player_state where number = 4)),
       ((select id from building where number = 16), (select id from player_state where number = 5)),
       ((select id from building where number = 28), (select id from player_state where number = 5)),
       ((select id from building where number = 10), (select id from player_state where number = 5)),
       ((select id from building where number = 50), (select id from player_state where number = 6)),
       ((select id from building where number = 14), (select id from player_state where number = 8)),
       ((select id from building where number = 51), (select id from player_state where number = 9)),
       ((select id from building where number = 5), (select id from player_state where number = 9)),

       ((select id from building where number = 26), (select id from player_state where number = 10)),
       ((select id from building where number = 47), (select id from player_state where number = 10)),
       ((select id from building where number = 2), (select id from player_state where number = 12)),
       ((select id from building where number = 17), (select id from player_state where number = 12)),
       ((select id from building where number = 55), (select id from player_state where number = 12)),
       ((select id from building where number = 34), (select id from player_state where number = 13)),
       ((select id from building where number = 18), (select id from player_state where number = 14)),
       ((select id from building where number = 9), (select id from player_state where number = 14)),
       ((select id from building where number = 22), (select id from player_state where number = 14)),

       ((select id from building where number = 54), (select id from player_state where number = 35)),
       ((select id from building where number = 6), (select id from player_state where number = 36)),
       ((select id from building where number = 25), (select id from player_state where number = 37)),
       ((select id from building where number = 31), (select id from player_state where number = 38)),

       ((select id from building where number = 1), (select id from player_state where number = 15)),
       ((select id from building where number = 23), (select id from player_state where number = 17)),

       ((select id from building where number = 18), (select id from player_state where number = 18)),
       ((select id from building where number = 6), (select id from player_state where number = 19)),
       ((select id from building where number = 37), (select id from player_state where number = 19)),
       ((select id from building where number = 40), (select id from player_state where number = 19)),
       ((select id from building where number = 50), (select id from player_state where number = 20)),
       ((select id from building where number = 13), (select id from player_state where number = 21)),
       ((select id from building where number = 54), (select id from player_state where number = 21)),

       ((select id from building where number = 2), (select id from player_state where number = 22)),
       ((select id from building where number = 17), (select id from player_state where number = 22)),
       ((select id from building where number = 22), (select id from player_state where number = 23)),
       ((select id from building where number = 35), (select id from player_state where number = 24)),
       ((select id from building where number = 44), (select id from player_state where number = 24)),
       ((select id from building where number = 56), (select id from player_state where number = 24)),
       ((select id from building where number = 19), (select id from player_state where number = 25)),
       ((select id from building where number = 21), (select id from player_state where number = 27)),
       ((select id from building where number = 43), (select id from player_state where number = 27)),

       ((select id from building where number = 8), (select id from player_state where number = 28)),
       ((select id from building where number = 12), (select id from player_state where number = 29)),
       ((select id from building where number = 19), (select id from player_state where number = 29)),
       ((select id from building where number = 23), (select id from player_state where number = 31)),
       ((select id from building where number = 29), (select id from player_state where number = 31)),
       ((select id from building where number = 31), (select id from player_state where number = 31)),
       ((select id from building where number = 37), (select id from player_state where number = 32)),
       ((select id from building where number = 42), (select id from player_state where number = 34)),
       ((select id from building where number = 49), (select id from player_state where number = 34)),
       ((select id from building where number = 56), (select id from player_state where number = 34)),
       ((select id from building where number = 42), (select id from player_state where number = 26)),
       ((select id from building where number = 29), (select id from player_state where number = 26)),
       ((select id from building where number = 19), (select id from player_state where number = 26)),
       ((select id from building where number = 56), (select id from player_state where number = 26));

-- Playerstatecharacter
Insert into player_state_characters(characters_id, player_state_id)
VALUES ((select id from game_character where name = 'Assassin'), (select id from player_state where number = 1)),
       ((select id from game_character where name = 'Warlord'), (select id from player_state where number = 1)),
       ((select id from game_character where name = 'King'), (select id from player_state where number = 2)),
       ((select id from game_character where name = 'Bishop'), (select id from player_state where number = 2)),
       ((select id from game_character where name = 'Magician'), (select id from player_state where number = 3)),
       ((select id from game_character where name = 'Architect'), (select id from player_state where number = 3)),

       ((select id from game_character where name = 'Bishop'), (select id from player_state where number = 4)),
       ((select id from game_character where name = 'Warlord'), (select id from player_state where number = 5)),
       ((select id from game_character where name = 'Architect'), (select id from player_state where number = 6)),
       ((select id from game_character where name = 'King'), (select id from player_state where number = 7)),
       ((select id from game_character where name = 'Thief'), (select id from player_state where number = 8)),
       ((select id from game_character where name = 'Assassin'), (select id from player_state where number = 9)),

       ((select id from game_character where name = 'King'), (select id from player_state where number = 10)),
       ((select id from game_character where name = 'Assassin'), (select id from player_state where number = 11)),
       ((select id from game_character where name = 'Warlord'), (select id from player_state where number = 12)),
       ((select id from game_character where name = 'Magician'), (select id from player_state where number = 13)),
       ((select id from game_character where name = 'Thief'), (select id from player_state where number = 14)),

       ((select id from game_character where name = 'Architect'), (select id from player_state where number = 35)),
       ((select id from game_character where name = 'Thief'), (select id from player_state where number = 36)),
       ((select id from game_character where name = 'Bishop'), (select id from player_state where number = 37)),
       ((select id from game_character where name = 'Merchant'), (select id from player_state where number = 38)),
       ((select id from game_character where name = 'Warlord'), (select id from player_state where number = 39)),

       ((select id from game_character where name = 'Thief'), (select id from player_state where number = 15)),
       ((select id from game_character where name = 'Assassin'), (select id from player_state where number = 16)),
       ((select id from game_character where name = 'Bishop'), (select id from player_state where number = 17)),


       ((select id from game_character where name = 'Magician'), (select id from player_state where number = 18)),
       ((select id from game_character where name = 'King'), (select id from player_state where number = 19)),
       ((select id from game_character where name = 'Bishop'), (select id from player_state where number = 20)),
       ((select id from game_character where name = 'Assassin'), (select id from player_state where number = 21)),

       ((select id from game_character where name = 'Assassin'), (select id from player_state where number = 22)),
       ((select id from game_character where name = 'Magician'), (select id from player_state where number = 23)),
       ((select id from game_character where name = 'Warlord'), (select id from player_state where number = 24)),
       ((select id from game_character where name = 'King'), (select id from player_state where number = 25)),
       ((select id from game_character where name = 'Bishop'), (select id from player_state where number = 26)),
       ((select id from game_character where name = 'Architect'), (select id from player_state where number = 27)),

       ((select id from game_character where name = 'Assassin'), (select id from player_state where number = 28)),
       ((select id from game_character where name = 'Thief'), (select id from player_state where number = 29)),
       ((select id from game_character where name = 'Magician'), (select id from player_state where number = 30)),
       ((select id from game_character where name = 'King'), (select id from player_state where number = 31)),
       ((select id from game_character where name = 'Bishop'), (select id from player_state where number = 32)),
       ((select id from game_character where name = 'Architect'), (select id from player_state where number = 33)),
       ((select id from game_character where name = 'Warlord'), (select id from player_state where number = 34));
-- Round
Insert into round(id, fase, completed, created_at, game_id, king_id, character_deck_id)
values (gen_random_uuid(), 'COMPLETED', true, '2009-04-02  14:09:06', (select id from game where coins_in_bank = 2),
        (select id from player where number = 1), (select id from character_deck)),
       ('238d363f-f5ba-45b1-abe9-e1ff7007ed38', 'COMPLETED', true, '2023-12-18 09:13:24', (select id from game where coins_in_bank = 21),
        (select id from player where number = 4), (select id from character_deck)),
       (gen_random_uuid(), 'COMPLETED', true, '2023-12-18 10:27:45', (select id from game where coins_in_bank = 21),
        (select id from player where number = 5), (select id from character_deck)),
       (gen_random_uuid(), 'COMPLETED', true, '2024-11-23 23:58:12', (select id from game where coins_in_bank = 8),
        (select id from player where number = 11), (select id from character_deck)),
       (gen_random_uuid(), 'COMPLETED', true, '2024-11-24 01:34:27', (select id from game where coins_in_bank = 15),
        (select id from player where number = 36), (select id from character_deck)),
       (gen_random_uuid(), 'COMPLETED', true, '2024-11-24 02:45:03', (select id from game where coins_in_bank = 15),
        (select id from player where number = 36), (select id from character_deck)),
       (gen_random_uuid(), 'CHARACTERCHOICEFASE', false, '2024-11-24 04:03:06',
        (select id from game where coins_in_bank = 15), (select id from player where number = 35),
        (select id from character_deck)),
       (gen_random_uuid(), 'ACTIONFASE', false, '2024-01-12 19:43:02', (select id from game where coins_in_bank = 26),
        (select id from player where number = 16), (select id from character_deck)),
       (gen_random_uuid(), 'COMPLETED', true, '2024-02-12 13:42:02', (select id from game where coins_in_bank = 7),
        (select id from player where number = 21), (select id from character_deck)),
       (gen_random_uuid(), 'CHARACTERCHOICEFASE', false, '2024-02-12 14:04:38',
        (select id from game where coins_in_bank = 7), (select id from player where number = 21),
        (select id from character_deck)),
       ('850fd19b-15ef-4003-a3a9-b1059753de2f', 'ACTIONFASE', false, '2024-11-30 17:29:56',
        (select id from game where coins_in_bank = 19),
        (select id from player where number = 26), (select id from character_deck)),
       (gen_random_uuid(), 'ACTIONFASE', false, '2024-01-12 03:29:47', (select id from game where coins_in_bank = 23),
        (select id from player where number = 31), (select id from character_deck));

-- Turn
Insert into turn(id, completed, round_id, player_state_id, has_drawn_building, amount_of_buildings_built_this_turn,
                 created_at)
values (gen_random_uuid(), true, (select id from round where created_at = '2024-01-12 19:43:02'),
        (select id from player_state where number = 15), true, 1, '2024-01-12 19:44:00'),
       (gen_random_uuid(), true, (select id from round where created_at = '2024-01-12 19:43:02'),
        (select id from player_state where number = 16), false, 1, '2024-01-12 19:45:00'),
       (gen_random_uuid(), true, (select id from round where created_at = '2024-01-12 19:43:02'),
        (select id from player_state where number = 17), true, 0, '2024-01-12 19:46:00'),

       ('edfe5f6f-807a-4c05-9c64-802a43ab7298', true, (select id from round where created_at = '2009-04-02 14:09:06'),
        (select id from player_state where number = 1), true, 2, '2009-04-02 14:10:00'),
       (gen_random_uuid(), true, (select id from round where created_at = '2009-04-02 14:09:06'),
        (select id from player_state where number = 2), false, 0, '2009-04-02 14:11:00'),
       (gen_random_uuid(), true, (select id from round where created_at = '2009-04-02 14:09:06'),
        (select id from player_state where number = 3), true, 1, '2009-04-02 14:12:00'),

       (gen_random_uuid(), true, (select id from round where created_at = '2023-12-18 09:13:24'),
        (select id from player_state where number = 4), true, 0, '2023-12-18 09:14:00'),
       (gen_random_uuid(), true, (select id from round where created_at = '2023-12-18 09:13:24'),
        (select id from player_state where number = 5), false, 2, '2023-12-18 09:15:00'),
       (gen_random_uuid(), true, (select id from round where created_at = '2023-12-18 09:13:24'),
        (select id from player_state where number = 6), false, 1, '2023-12-18 09:16:00'),
       (gen_random_uuid(), true, (select id from round where created_at = '2023-12-18 09:13:24'),
        (select id from player_state where number = 7), true, 0, '2023-12-18 09:17:00'),
       (gen_random_uuid(), true, (select id from round where created_at = '2023-12-18 09:13:24'),
        (select id from player_state where number = 8), false, 0, '2023-12-18 09:18:00'),
       ('28d76580-390a-4090-b21a-3db2a15c0dc9', true, (select id from round where created_at = '2023-12-18 09:13:24'),
        (select id from player_state where number = 9), true, 1, '2023-12-18 09:19:00'),

       (gen_random_uuid(), true, (select id from round where created_at = '2023-12-18 10:27:45'),
        (select id from player_state where number = 4), false, 0, '2023-12-18 10:28:00'),
       (gen_random_uuid(), true, (select id from round where created_at = '2023-12-18 10:27:45'),
        (select id from player_state where number = 5), true, 1, '2023-12-18 10:29:00'),
       (gen_random_uuid(), true, (select id from round where created_at = '2023-12-18 10:27:45'),
        (select id from player_state where number = 6), false, 2, '2023-12-18 10:30:00'),
       (gen_random_uuid(), true, (select id from round where created_at = '2023-12-18 10:27:45'),
        (select id from player_state where number = 7), false, 1, '2023-12-18 10:31:00'),
       (gen_random_uuid(), true, (select id from round where created_at = '2023-12-18 10:27:45'),
        (select id from player_state where number = 8), false, 0, '2023-12-18 10:32:00'),
       (gen_random_uuid(), true, (select id from round where created_at = '2023-12-18 10:27:45'),
        (select id from player_state where number = 9), false, 0, '2023-12-18 10:33:00'),

       (gen_random_uuid(), true, (select id from round where created_at = '2024-02-12 13:42:02'),
        (select id from player_state where number = 18), false, 2, '2024-02-12 13:43:00'),
       (gen_random_uuid(), true, (select id from round where created_at = '2024-02-12 13:42:02'),
        (select id from player_state where number = 19), true, 1, '2024-02-12 13:44:00'),
       (gen_random_uuid(), true, (select id from round where created_at = '2024-02-12 13:42:02'),
        (select id from player_state where number = 20), true, 0, '2024-02-12 13:45:00'),
       (gen_random_uuid(), true, (select id from round where created_at = '2024-02-12 13:42:02'),
        (select id from player_state where number = 21), false, 1, '2024-02-12 13:46:00'),

       ('18f807c3-74e9-4754-b7d1-f00da20d0fe9', true, (select id from round where created_at = '2024-11-30 17:29:56'),
        (select id from player_state where number = 22), false, 1, '2024-11-30 17:30:00'),
       ('b6ae8595-773a-41ad-b478-ff059e90c8b3', true, (select id from round where created_at = '2024-11-30 17:29:56'),
        (select id from player_state where number = 23), false, 1, '2024-11-30 17:31:00'),
       ('2270b3ac-e159-4659-b8ee-954129d22c2e', true, (select id from round where created_at = '2024-11-30 17:29:56'),
        (select id from player_state where number = 24), false, 0, '2024-11-30 17:32:00'),
       ('9fca5a70-ac56-4103-93ac-976fd9a774e4', true, (select id from round where created_at = '2024-11-30 17:29:56'),
        (select id from player_state where number = 25), false, 1, '2024-11-30 17:33:00'),
       ('b2e4d980-1451-44e4-9ae8-a07bb8ff71dc', true, (select id from round where created_at = '2024-11-30 17:29:56'),
        (select id from player_state where number = 26), false, 1, '2024-11-30 17:34:00'),
       ('a2014944-c8a5-4f56-9d5d-45b1106b7e96', true, (select id from round where created_at = '2024-11-30 17:29:56'),
        (select id from player_state where number = 27), false, 1, '2024-11-30 17:35:00'),

       (gen_random_uuid(), true, (select id from round where created_at = '2024-01-12 03:29:47'),
        (select id from player_state where number = 28), true, 1, '2024-01-12 03:30:00'),
       (gen_random_uuid(), true, (select id from round where created_at = '2024-01-12 03:29:47'),
        (select id from player_state where number = 29), false, 1, '2024-01-12 03:31:00'),
       (gen_random_uuid(), true, (select id from round where created_at = '2024-01-12 03:29:47'),
        (select id from player_state where number = 30), true, 0, '2024-01-12 03:32:00'),

       (gen_random_uuid(), true, (select id from round where created_at = '2024-11-24 04:03:06'), (select id from player_state where number = 35), true, 1, '2024-11-24 04:04:00'),
       (gen_random_uuid(), true, (select id from round where created_at = '2024-11-24 04:03:06'), (select id from player_state where number = 36), false, 1, '2024-11-24 04:05:00'),
       (gen_random_uuid(), true, (select id from round where created_at = '2024-11-24 04:03:06'), (select id from player_state where number = 37), true, 0, '2024-11-24 04:06:00'),
       (gen_random_uuid(), true, (select id from round where created_at = '2024-11-24 04:03:06'), (select id from player_state where number = 38), false, 1, '2024-11-24 04:07:00'),
       (gen_random_uuid(), true, (select id from round where created_at = '2024-11-24 04:03:06'), (select id from player_state where number = 39), true, 1, '2024-11-24 04:08:00');

INSERT INTO leaderboard (id)
VALUES (gen_random_uuid());

-- Player Scores
INSERT INTO player_score (id, rank, score, game_date, game_id, player_id, profile_id, user_name)
VALUES (gen_random_uuid(), 1, 100, '2024-11-30 15:30:00', (select id from game where coins_in_bank = 2),
        (SELECT id FROM player WHERE number = 1), (SELECT id FROM profile WHERE user_name = 'DrDiabetes'),
        'DrDiabetes'),
       (gen_random_uuid(), 2, 90, '2024-11-29 14:25:00', (select id from game where coins_in_bank = 21),
        (SELECT id FROM player WHERE number = 2), (SELECT id FROM profile WHERE user_name = 'Happybebb'), 'Happybebb'),
       (gen_random_uuid(), 3, 85, '2024-11-28 13:20:00', (select id from game where coins_in_bank = 8),
        (SELECT id FROM player WHERE number = 3), (SELECT id FROM profile WHERE user_name = 'Ghostie'), 'Ghostie'),
       (gen_random_uuid(), 4, 80, '2024-11-27 12:15:00', (select id from game where coins_in_bank = 15),
        (SELECT id FROM player WHERE number = 4), (SELECT id FROM profile WHERE user_name = 'Iebie'), 'Iebie'),
       (gen_random_uuid(), 5, 75, '2024-11-26 11:10:00', (select id from game where coins_in_bank = 26),
        (SELECT id FROM player WHERE number = 5), (SELECT id FROM profile WHERE user_name = 'Ilian'), 'Ilian'),
       (gen_random_uuid(), 6, 70, '2024-11-25 10:05:00', (select id from game where coins_in_bank = 7),
        (SELECT id FROM player WHERE number = 6), (SELECT id FROM profile WHERE user_name = 'Frank'), 'Frank'),
       (gen_random_uuid(), 7, 65, '2024-11-24 09:00:00', (select id from game where coins_in_bank = 19),
        (SELECT id FROM player WHERE number = 7), (SELECT id FROM profile WHERE user_name = 'Skye'), 'Skye'),
       (gen_random_uuid(), 8, 60, '2024-11-23 08:55:00', (select id from game where coins_in_bank = 23),
        (SELECT id FROM player WHERE number = 8), (SELECT id FROM profile WHERE user_name = 'IMathy'), 'IMathy'),
       (gen_random_uuid(), 9, 55, '2024-11-22 07:50:00', (select id from game where coins_in_bank = 30),
        (SELECT id FROM player WHERE number = 9), (SELECT id FROM profile WHERE user_name = 'Mickeyflora'),
        'Mickeyflora'),
       (gen_random_uuid(), 10, 50, '2024-11-21 06:45:00', (select id from game where coins_in_bank = 30),
        (SELECT id FROM player WHERE number = 10), (SELECT id FROM profile WHERE user_name = 'FeistyFireFlower'),
        'FeistyFireFlower');

-- Leaderboard Scores
INSERT INTO leaderboard_scores (leaderboard_id, scores_id)
VALUES ((SELECT id FROM leaderboard LIMIT 1), (SELECT id FROM player_score WHERE user_name = 'DrDiabetes')),
       ((SELECT id FROM leaderboard LIMIT 1), (SELECT id FROM player_score WHERE user_name = 'Happybebb')),
       ((SELECT id FROM leaderboard LIMIT 1), (SELECT id FROM player_score WHERE user_name = 'Ghostie')),
       ((SELECT id FROM leaderboard LIMIT 1), (SELECT id FROM player_score WHERE user_name = 'Iebie')),
       ((SELECT id FROM leaderboard LIMIT 1), (SELECT id FROM player_score WHERE user_name = 'Ilian')),
       ((SELECT id FROM leaderboard LIMIT 1), (SELECT id FROM player_score WHERE user_name = 'Frank')),
       ((SELECT id FROM leaderboard LIMIT 1), (SELECT id FROM player_score WHERE user_name = 'Skye')),
       ((SELECT id FROM leaderboard LIMIT 1), (SELECT id FROM player_score WHERE user_name = 'IMathy')),
       ((SELECT id FROM leaderboard LIMIT 1), (SELECT id FROM player_score WHERE user_name = 'Mickeyflora')),
       ((SELECT id FROM leaderboard LIMIT 1), (SELECT id FROM player_score WHERE user_name = 'FeistyFireFlower'));
-- Invitations
insert into invitation(id, accepted)
values ('70668926-985a-444e-939d-2b752e48e69b', false)