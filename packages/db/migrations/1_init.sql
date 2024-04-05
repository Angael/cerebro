create table user
(
    id              varchar(64)                       not null primary key,

    email           varchar(254)                      not null,
    hashed_password varchar(256)                      not null,
    type            enum ('FREE', 'PREMIUM', 'ADMIN') not null,

    last_login_at   datetime(3),
    created_at      datetime(3) default CURRENT_TIMESTAMP,
    updated_at      datetime(3) default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP
);

create table user_session
(
    id           varchar(64) not null primary key,
    user_session varchar(64) not null,
    user_id      varchar(64) not null
);

create table item
(
    id         int unsigned auto_increment primary key,
    user_id    varchar(64)                                       not null,

    private    tinyint(1)                           default 0    not null,
    type       enum ('IMAGE', 'VIDEO')                           not null,
    processed  enum ('NO', 'STARTED', 'FAIL', 'V1') default 'NO' not null,
    optimized  enum ('NO', 'STARTED', 'FAIL', 'V1') default 'NO' not null,

    created_at datetime(3)                          default CURRENT_TIMESTAMP,
    updated_at datetime(3)                          default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,

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

    created_at datetime(3) default CURRENT_TIMESTAMP,

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

    created_at datetime(3) default CURRENT_TIMESTAMP,

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
)

