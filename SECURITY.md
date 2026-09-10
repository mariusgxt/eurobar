# Benutzer-API

Die API verwendet HTTP Basic und schützt schreibende Anfragen mit CSRF-Tokens. Im produktiven Betrieb ist HTTPS erforderlich. Vor POST, PUT oder DELETE zunächst GET `/api/csrf` aufrufen und das zurückgegebene Token mit seinem `headerName` senden. Das Sitzungscookie muss erhalten bleiben. Die Registrierung unter `/api/users/register` ist öffentlich, benötigt aber ebenfalls das CSRF-Token.

Benutzer können ausschließlich ihren eigenen Datensatz lesen, ändern und löschen. Die Listenroute liefert nur das eigene Konto. Passwörter werden mit BCrypt gespeichert und aus JSON-Antworten entfernt. `/api/users/login` prüft die vom Security-Filter authentifizierte Identität; Zugangsdaten werden über HTTP Basic übergeben.

Bestehende Klartext-Passwörter sind nicht mit BCrypt kompatibel. Vor einer Umstellung müssen sie in einer kontrollierten Migration gehasht oder über einen sicheren Rücksetzprozess ersetzt werden. Diese Änderung migriert oder löscht keine vorhandenen Daten. Für einen öffentlichen Betrieb fehlen insbesondere ein Passwort-Rücksetzprozess und eine Begrenzung von Anmeldeversuchen am vorgeschalteten Server.

Das Formular für Produktergänzungen fragt nach dem bestehenden Konto und sendet Anmeldung und CSRF-Token mit. Das Passwort bleibt nur im Arbeitsspeicher und wird nach dem Versuch oder beim Abbrechen geleert. Die Oberfläche zum Anlegen und Zurücksetzen von Konten fehlt noch. Der Browserablauf muss gegen eine konfigurierte Datenbank geprüft werden; die lokalen Tests verwenden isolierte Testdaten.
