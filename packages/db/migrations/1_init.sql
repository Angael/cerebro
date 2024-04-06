create database if not exists cerebro2;
use cerebro2;

create table user
(
    id              varchar(64)                       not null primary key,

    email           varchar(254)                      not null unique,
    hashed_password varchar(256)                      not null,
    type            enum ('FREE', 'PREMIUM', 'ADMIN') not null,

    last_login_at   datetime(3),
    created_at      datetime(3) default CURRENT_TIMESTAMP(3),
    updated_at      datetime(3) default CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3)
);

create table user_session
(
    id           varchar(64) not null primary key,
    user_id      varchar(64) not null unique,
    expires_at   datetime(3) not null
);

create table item
(
    id         int unsigned auto_increment primary key,
    user_id    varchar(64)                                       not null,

    private    tinyint(1)                           default 0    not null,
    type       enum ('IMAGE', 'VIDEO')                           not null,
    processed  enum ('NO', 'STARTED', 'FAIL', 'V1') default 'NO' not null,
    optimized  enum ('NO', 'STARTED', 'FAIL', 'V1') default 'NO' not null,

    created_at datetime(3)                          default CURRENT_TIMESTAMP(3),
    updated_at datetime(3)                          default CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),

    constraint item_user_id_fkey
        foreign key (user_id) references user (id) on update cascade
);

create table image
(
    id         int unsigned auto_increment primary key,
    item_id    int unsigned                  not null,

    path       varchar(256)                  not null,
    size       int unsigned                  not null,
    width      int unsigned                  not null,
    height     int unsigned                  not null,
    media_type enum ('SOURCE', 'COMPRESSED') not null,

    created_at datetime(3) default CURRENT_TIMESTAMP(3),

    constraint image_item_id_fkey
        foreign key (item_id) references item (id)
            on update cascade
);


create table thumbnail
(
    id         int unsigned auto_increment primary key,
    item_id    int unsigned            not null,

    type       enum ('XS', 'SM', 'MD') not null,
    width      int unsigned            not null,
    height     int unsigned            not null,
    path       varchar(256)            not null,
    size       int unsigned            not null,

    created_at datetime(3) default CURRENT_TIMESTAMP(3),

    constraint thumbnail_item_id_fkey
        foreign key (item_id) references item (id)
            on update cascade
);

create table video
(
    id          int unsigned auto_increment primary key,
    item_id     int unsigned                             not null,

    path        varchar(256)                             not null,
    size        int unsigned                             not null,
    width       smallint unsigned                        not null,
    height      smallint unsigned                        not null,
    bitrate_kb  mediumint unsigned                       not null,
    duration_ms int unsigned                             not null,
    media_type  enum ('SOURCE', 'COMPRESSED')            not null,

    created_at  datetime(3) default CURRENT_TIMESTAMP(3) not null,

    constraint video_item_id_fkey
        foreign key (item_id) references item (id)
            on update cascade
);

# migrate old data
INSERT IGNORE INTO cerebro2.user (id, email, hashed_password, type, last_login_at)
SELECT uid, email, '', type, CURRENT_TIMESTAMP(3) FROM cerebro.User;

INSERT IGNORE INTO cerebro2.item (id, user_id, type, private, processed, optimized, created_at, updated_at)
SELECT id, userUid, type, private, processed, optimized, createdAt, updatedAt FROM cerebro.Item;

INSERT IGNORE INTO cerebro2.image (id, item_id, path, size, width, height, media_type, created_at)
SELECT id, itemId, path, size, width, height, mediaType, createdAt FROM cerebro.Image;

INSERT IGNORE INTO cerebro2.video (id, item_id, path, size, width, height, bitrate_kb, duration_ms, media_type, created_at)
SELECT id, itemId, path, size, width, height, bitrateKb, durationMs, mediaType, createdAt FROM cerebro.Video;

INSERT IGNORE INTO cerebro2.thumbnail (id, item_id, type, width, height, path, size, created_at)
SELECT id, itemId, type, width, height, path, size, createdAt FROM cerebro.Thumbnail;