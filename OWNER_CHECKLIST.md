# Чеклист владельца: GitHub Actions → Hetzner

В репозитории уже находится deployment workflow. Пункты ниже требуют доступа к
вашим GitHub, Hetzner и DNS-аккаунтам, поэтому их нельзя выполнить локально.

## 1. Репозиторий GitHub

- [ ] Отправить текущие изменения в `origin/master` или `origin/main`.
- [ ] Убедиться, что во вкладке Actions успешно проходит workflow `CI`.
- [ ] В Settings → Actions → General разрешить Actions читать репозиторий и
  записывать packages (`Read and write permissions`), если политика репозитория
  не выдаёт `packages: write` из workflow.
- [ ] Создать GitHub Environment с точным именем `production`.
- [ ] Ограничить Environment ветками `main`/`master`; включить подтверждение
  деплоя, если ваш GitHub-тариф это поддерживает.

## 2. Сервер Hetzner

- [ ] Создать Ubuntu/Debian server: минимум 2 vCPU, 4 GB RAM.
- [ ] Установить Docker Engine, Docker Compose plugin, OpenSSL и SSH server.
- [ ] Создать отдельного пользователя `deploy`, добавить его в группу `docker`.
- [ ] Создать `/opt/olegthelilfix` с владельцем `deploy:deploy` и правами `0750`.
- [ ] Разрешить в firewall SSH, TCP 80/443 и UDP 443.
- [ ] Убедиться, что 3000, 5432 и 1337 не открыты в интернет.
- [ ] Проверить под пользователем `deploy`: `docker run --rm hello-world`.

## 3. SSH для GitHub Actions

- [ ] Создать отдельный ключ `~/.ssh/olegthelilfix_deploy`.
- [ ] Добавить только публичную часть ключа в
  `/home/deploy/.ssh/authorized_keys` на сервере.
- [ ] Получить SSH host key сервера и сверить fingerprint через Hetzner Console.
- [ ] Добавить secret `HETZNER_HOST` — IP или hostname сервера.
- [ ] Добавить secret `HETZNER_SSH_PRIVATE_KEY` — полный приватный deployment key.
- [ ] Добавить secret `HETZNER_SSH_KNOWN_HOSTS` — проверенную строку host key.
- [ ] Если значения отличаются от стандартных, добавить variables:
  `HETZNER_SSH_USER`, `HETZNER_SSH_PORT`, `HETZNER_DEPLOY_PATH`.
- [ ] Не добавлять production `.env` или его значения в GitHub Secrets: он будет
  создан непосредственно на сервере.

## 4. Первый безопасный запуск

- [ ] В Actions вручную запустить `Deploy to Hetzner` в режиме `bootstrap`.
- [ ] Убедиться, что Action завершился успешно.
- [ ] Открыть SSH tunnel для локального порта 1337 по инструкции
  [DEPLOY.md](./DEPLOY.md).
- [ ] Через tunnel создать первого администратора Strapi.
- [ ] Сохранить зашифрованную внешнюю копию
  `/opt/olegthelilfix/shared/.env`.
- [ ] Больше не запускать режим `bootstrap`.

## 5. DNS и production

- [ ] Создать A-записи для apex, `www` и `cms` на IPv4 Hetzner.
- [ ] Добавлять AAAA только при полностью настроенном IPv6/firewall.
- [ ] Дождаться публичного обновления DNS.
- [ ] Запустить `Deploy to Hetzner` вручную в режиме `production`.
- [ ] Проверить `https://olegthelilfix.me` и TLS всех поддоменов.
- [ ] Запустить `npm run smoke -- https://olegthelilfix.me`.
- [ ] Проверить CMS `/_health`.
- [ ] Проверить, что private-запись Strapi не читается анонимно.
- [ ] Проверить сохранность Strapi uploads после restart контейнера.

## 6. После успешного запуска

- [ ] Добавить GitHub Actions variable `AUTO_DEPLOY_ENABLED=true`, если каждый
  успешный push в `main`/`master` должен автоматически идти в production.
- [ ] Настроить uptime checks сайта и CMS.
- [ ] Настроить зашифрованное off-server хранилище backup.
- [ ] Выполнить `scripts/backup.sh` и проверить восстановление на временном host.
- [ ] Проверить реальные имя, CV, контакты, даты и публичность контента.
- [ ] Заменить placeholder-медиа или явно принять запуск с ними.
- [ ] Проверить расхождение каталогов: сейчас заполнены 12/214 пластинок и 8/46
  открыток.
