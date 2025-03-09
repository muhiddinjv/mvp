# mvp

- https://quranwbw.com/36 the first word plays the word below: 
- words: https://words.audios.quranwbw.com/36/036_001_001.mp3
- ayahs: https://everyayah.com/data/Alafasy_128kbps/036002.mp3
- MEGA SOURCE: https://github.com/risan/quran-json/tree/main
- major source 1 for data: https://github.com/qazasaz/quranwbw
- major source 2 for data: https://github.com/hablullah/data-quran
- major source 3 for data: https://github.com/gadingnst/quran-api
- major source 4 for data https://www.surequran.com/download/
- major source 5 for data https://everyayah.com/data/tools/
- major source 6 for data: https://corpus.quran.com/verbs.jsp?page=1

vscode extension: markdown preview mermaid support
```mermaid
mindmap
  root((READING))
    [audio]
      (play/pause)
      (loop 100x)
      (delay length)
    [feature 2]
      (Lorem Iposum)
      (Lorem Iposum)
    [feature 3]
      (Lorem Iposum)
      (Lorem Iposum)
    [Chapter]
      (Title)
        (Translit)
        (Arabic)
        (English)
      (Location)
      (Verses)
        (number)
        (bookmark)
      (Words)
      (Bow)
```

## Blogging app service communication
```mermaid
sequenceDiagram
    participant web as Web Browser
    participant blog as Blog Service
    participant account as Account Service
    participant mail as Mail Service
    participant db as Storage

    Note over web,db: The user must be logged in to submit blog posts
    web->>+account: Logs in using credentials
    account->>db: Query stored accounts
    db->>account: Respond with query result

    alt Credentials not found
        account->>web: Invalid credentials
    else Credentials found
        account->>-web: Successfully logged in

        Note over web,db: When the user is authenticated, they can now submit new posts
        web->>+blog: Submit new post
        blog->>db: Store post data

        par Notifications
            blog--)mail: Send mail to blog subscribers
            blog--)db: Store in-site notifications
        and Response
            blog-->>-web: Successfully posted
        end
    end
```
