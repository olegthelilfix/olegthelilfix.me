# Чеклист владельца: файловый контент и Hetzner

## GitHub

- [ ] Отправить миграцию в `master` или `main`.
- [ ] Убедиться, что workflow `CI` прошёл успешно.
- [ ] Проверить Environment `production` и secrets:
  `HETZNER_HOST`, `HETZNER_SSH_PRIVATE_KEY`,
  `HETZNER_SSH_KNOWN_HOSTS`.
- [ ] Оставить `AUTO_DEPLOY_ENABLED=true`, если каждый успешный push должен
  автоматически публиковаться.

## Первый deploy без Strapi

- [ ] Запустить `Deploy to Hetzner` вручную.
- [ ] Проверить `https://olegthelilfix.me` и
  `npm run smoke -- https://olegthelilfix.me`.
- [ ] На сервере проверить, что работают только `caddy` и `web`.
- [ ] Проверить, что контейнеры `cms`, `mcp` и `db` удалены.
- [ ] Не удалять старые Docker volumes до проверки сайта и резервной копии.

## DNS и локальная настройка

- [ ] Удалить DNS-запись `cms.olegthelilfix.me`.
- [ ] Убедиться, что публичной записи `mcp.olegthelilfix.me` нет.
- [ ] Остановить старый SSH tunnel на локальный порт 3001.
- [ ] Удалить MCP server `oleg_strapi` из Codex, когда он больше не нужен.

## Контент

- [ ] Проверить реальные имя, CV, контакты и даты в `content/`.
- [ ] Заменить демонстрационные записи или явно принять их публикацию.
- [ ] Перед каждым push выполнять `npm run check`.
- [ ] Помнить: изменение становится публичным только после commit, push и
  успешного deploy.
