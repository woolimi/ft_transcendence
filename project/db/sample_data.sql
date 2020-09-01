select * from guilds

insert into guilds(name, anagram, created_at, updated_at) values('Demonical', 'Lemon', current_timestamp, current_timestamp);
insert into guilds(name, anagram, created_at, updated_at) values('Sunrisers', 'Riser', current_timestamp, current_timestamp);
insert into guilds(name, anagram, created_at, updated_at) values('Royals', 'Raoyl', current_timestamp, current_timestamp);

commit;

---------

select * from user_profiles

select * from matches

insert into matches(score, players, winner, loser, created_at, updated_at) values('3:0', '{64e7d124-07ab-4ce8-bbd1-39be4d7199aa,698c8d58-ddf7-4330-8656-1812fb3a04db}', '64e7d124-07ab-4ce8-bbd1-39be4d7199aa','698c8d58-ddf7-4330-8656-1812fb3a04db', current_timestamp, current_timestamp);
insert into matches(score, players, winner, loser, created_at, updated_at) values('1:2', '{64e7d124-07ab-4ce8-bbd1-39be4d7199aa,698c8d58-ddf7-4330-8656-1812fb3a04db}', '64e7d124-07ab-4ce8-bbd1-39be4d7199aa','698c8d58-ddf7-4330-8656-1812fb3a04db', current_timestamp, current_timestamp);
insert into matches(score, players, winner, loser, created_at, updated_at) values('3:5', '{64e7d124-07ab-4ce8-bbd1-39be4d7199aa,698c8d58-ddf7-4330-8656-1812fb3a04db}', '64e7d124-07ab-4ce8-bbd1-39be4d7199aa','698c8d58-ddf7-4330-8656-1812fb3a04db', current_timestamp, current_timestamp);

insert into matches(score, players, winner, loser, created_at, updated_at) values('13:5', '{64e7d124-07ab-4ce8-bbd1-39be4d7199aa,698c8d58-ddf7-4330-8656-1812fb3a04db}', '64e7d124-07ab-4ce8-bbd1-39be4d7199aa','698c8d58-ddf7-4330-8656-1812fb3a04db', current_timestamp, current_timestamp);
insert into matches(score, players, winner, loser, created_at, updated_at) values('3:15', '{64e7d124-07ab-4ce8-bbd1-39be4d7199aa,698c8d58-ddf7-4330-8656-1812fb3a04db}', '64e7d124-07ab-4ce8-bbd1-39be4d7199aa','698c8d58-ddf7-4330-8656-1812fb3a04db', current_timestamp, current_timestamp);
insert into matches(score, players, winner, loser, created_at, updated_at) values('13:5', '{64e7d124-07ab-4ce8-bbd1-39be4d7199aa,698c8d58-ddf7-4330-8656-1812fb3a04db}', '64e7d124-07ab-4ce8-bbd1-39be4d7199aa','698c8d58-ddf7-4330-8656-1812fb3a04db', current_timestamp, current_timestamp);


---------

select * from guilds

insert into wars(guild_1, guild_2, guild_1_score, guild_2_score, guild_1_matches_won, guild_1_matches_lost, guild_1_matches_unanswered, guild_2_matches_won, guild_2_matches_lost, guild_2_matches_unanswered, start_date, end_date, wager, match_list, created_at, updated_at)
values ('3a6ea760-9d93-4313-8e88-e562fe528aef', '05db40c5-96b8-4c9b-824f-cf90d2089a4b', 5, 0, 1, 0, 0, 0, 1, 0, current_timestamp, current_timestamp, 100, '{307e9b4d-a9a9-47c4-acfd-56e006c6b1f8,a529a440-72f7-4073-a4cf-9cea8d44bbb7}', current_timestamp, current_timestamp);


select * from wars  