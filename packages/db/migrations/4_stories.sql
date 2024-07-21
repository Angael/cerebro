CREATE TABLE cerebro2.story
(
    id          VARCHAR(64)  NOT NULL PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,
    description TEXT,
    dialogs     JSON,
    first_dialog_id VARCHAR(64),
    created_at  datetime(3) default CURRENT_TIMESTAMP(3),
    updated_at  datetime(3) default CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
    user_id     VARCHAR(64)  NOT NULL,

    constraint story_user_id_fkey
        foreign key (user_id) references user (id)
            on update cascade
);

