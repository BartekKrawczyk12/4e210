Projekt jest aplikacją webową napisaną w Node.js z użyciem frameworka Express oraz silnika szablonów EJS.
Aplikacja symuluje prostą grę w Blackjacka, umożliwiając rozegranie partii, zapis historii gier oraz ich przeglądanie, filtrowanie i sortowanie.

Dane gier przechowywane są w bazie danych MongoDB.
Projekt realizuje architekturę MVC (Model - View - Controller).

Funkcjonalności:

-Rozgrywka w Blackjacka (gracz vs krupier)
-Dobieranie kart (Hit)
-Zatrzymanie tury gracza (Stand)
-Automatyczne dobieranie kart przez krupiera (do sumy > 16)
-Sprawdzanie warunków wygranej, przegranej (BUST) lub remisu
-Historia rozegranych gier
-Filtrowanie gier po nazwie krupiera (GET)
-Hashowanie haseł przy edycji nazw krupiera, aby chronić dane przed podglądaniem w bazie.
    Aby zmienić nazwę krupiera:
    1. Przejdź do /dealer/:id
    2. Wprowadź nową nazwę krupiera
    3. Podaj hasło zabezpieczające zmianę (hasło jest hashowane w bazie)
    4. Zatwierdź zmianę
-Sortowanie gier po:
    -dacie utworzenia
    -sumie kart gracza
    -sumie kart krupiera
-Dodawanie nowej gry
-Edycja nazwy krupiera
-Usuwanie gry
-Widok zasad gry
-Obsługa błędów
-Walidacja danych wejściowych (np. długość nazwy krupiera)

Wymagania:

Node.js (v18+)
MongoDB (lokalnie lub przez Docker)
Kroki uruchomienia:


    -Przejdź do katalogu projektu:
    BlackJack

    -Zainstaluj zależności:
    npm install

    -Uruchom serwer:
    npm start

    -Otwórz przeglądarkę:
    http://localhost:3000


Lista endpointów:

    GET /
    Lista rozegranych gier
    Obsługuje filtrację i sortowanie (query params)

    GET /new
    Formularz dodawania nowej gry

    POST /new
    Utworzenie nowej gry

    GET /current
    Widok aktualnej gry

    POST /current/hit
    Dobranie karty przez gracza

    POST /current/stand
    Zatrzymanie tury gracza i ruch krupiera

    GET /dealer/:id
    Formularz edycji nazwy krupiera

    POST /dealer/:id
    Zapis zmienionej nazwy krupiera

    POST /remove/:id
    Usunięcie gry

    GET /rules
    Zasady gry Blackjack


Technologie:

    -Node.js
    -Express
    -MongoDB
    -EJS
    -JavaScript
    -HTML

Autor: Bartosz Krawczyk
