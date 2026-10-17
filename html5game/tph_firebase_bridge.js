var gmFirebaseDB = null;

var gmFirebaseSaveStatus = 0;

var gmFirebaseRankStatus = 0;
// 0 = parado
// 1 = calculando
// 2 = sucesso
// -1 = erro

var gmFirebasePlayerRank = 0;


// ========================================
// INICIALIZA FIREBASE
// ========================================

function fb_init()
{
    try
    {
        if (typeof firebase === "undefined")
        {
            console.error(
                "Firebase SDK não carregado."
            );

            return 0;
        }


        var firebaseConfig =
        {
            apiKey: "AIzaSyCWX5IZvmVnFeIjh-WEj6WoO0KhJSAvxEM",

            authDomain:
                "memoria-3cpm.firebaseapp.com",

            projectId:
                "memoria-3cpm",

            storageBucket:
                "memoria-3cpm.firebasestorage.app",

            messagingSenderId:
                "47068010559",

            appId:
                "1:47068010559:web:e07a288871ac4f1217408a",

            measurementId:
                "G-N7Y5QDSW1H"
        };


        if (firebase.apps.length === 0)
        {
            firebase.initializeApp(
                firebaseConfig
            );
        }


        gmFirebaseDB =
            firebase.firestore();


        console.log(
            "Firebase inicializado com sucesso."
        );


        return 1;
    }
    catch (e)
    {
        console.error(
            "Erro ao inicializar Firebase:",
            e
        );

        return 0;
    }
}


// ========================================
// SALVA PONTUAÇÃO
// ========================================

function fb_save_score(
    nome,
    turma,
    tempo_ms,
    jogadas,
    erros
)
{
    if (gmFirebaseDB === null)
    {
        console.error(
            "Firestore não inicializado."
        );

        gmFirebaseSaveStatus = -1;

        return 0;
    }


    gmFirebaseSaveStatus = 1;


    gmFirebaseDB
        .collection("ranking")
        .add(
        {
            nome:
                String(nome),

            turma:
                String(turma),

            tempo_ms:
                Math.floor(
                    Number(tempo_ms)
                ),

            jogadas:
                Math.floor(
                    Number(jogadas)
                ),

            erros:
                Math.floor(
                    Number(erros)
                )
        })
        .then(function(docRef)
{
    gmFirebaseSaveStatus = 2;

    console.log(
        "Pontuação salva no Firestore. ID:",
        docRef.id
    );


    // ====================================
    // CALCULA POSIÇÃO GLOBAL
    // ====================================

    gmFirebaseRankStatus = 1;


    gmFirebaseDB
        .collection("ranking")
        .orderBy("tempo_ms", "asc")
        .limit(100)
        .get()

        .then(function(snapshot)
        {
            var ranking = [];


            snapshot.forEach(function(doc)
            {
                var data = doc.data();

                ranking.push(
                {
                    id: doc.id,

                    tempo_ms:
                        Number(data.tempo_ms || 0),

                    jogadas:
                        Number(data.jogadas || 0),

                    erros:
                        Number(data.erros || 0)
                });
            });


            // Mesmo critério do ranking local:
            //
            // 1. menor tempo
            // 2. menos jogadas
            // 3. menos erros

            ranking.sort(function(a, b)
            {
                if (a.tempo_ms != b.tempo_ms)
                {
                    return a.tempo_ms - b.tempo_ms;
                }

                if (a.jogadas != b.jogadas)
                {
                    return a.jogadas - b.jogadas;
                }

                if (a.erros != b.erros)
                {
                    return a.erros - b.erros;
                }

                // Último desempate estável
                return a.id.localeCompare(b.id);
            });


            gmFirebasePlayerRank = 0;


            for (
                var i = 0;
                i < ranking.length;
                i++
            )
            {
                if (ranking[i].id == docRef.id)
                {
                    gmFirebasePlayerRank = i + 1;
                    break;
                }
            }


            // Não entrou no Top 100
            if (gmFirebasePlayerRank == 0)
            {
                gmFirebasePlayerRank = 101;
            }


            gmFirebaseRankStatus = 2;


            console.log(
                "Posição global:",
                gmFirebasePlayerRank
            );
        })

        .catch(function(error)
        {
            gmFirebaseRankStatus = -1;

            console.error(
                "Erro calculando posição global:",
                error
            );
        });
})


    return 1;
}


// ========================================
// STATUS DA GRAVAÇÃO
// ========================================

function fb_get_save_status()
{
    return gmFirebaseSaveStatus;
}

// ========================================
// RANKING GLOBAL - TOP 5
// ========================================

var gmFirebaseLoadStatus = 0;
// 0 = parado
// 1 = carregando
// 2 = sucesso
// -1 = erro

var gmFirebaseTop5JSON = "[]";


function fb_load_top5()
{
    if (gmFirebaseDB === null)
    {
        console.error(
            "Firestore não inicializado."
        );

        gmFirebaseLoadStatus = -1;

        return 0;
    }


    gmFirebaseLoadStatus = 1;


    gmFirebaseDB
        .collection("ranking")

        .orderBy(
            "tempo_ms",
            "asc"
        )

        .limit(5)

        .get()

        .then(function(snapshot)
        {
            var ranking = [];


            snapshot.forEach(
                function(doc)
                {
                    var data =
                        doc.data();


                    ranking.push(
                    {
                        nome:
                            String(
                                data.nome || ""
                            ),

                        turma:
                            String(
                                data.turma || ""
                            ),

                        tempo_ms:
                            Number(
                                data.tempo_ms || 0
                            ),

                        jogadas:
                            Number(
                                data.jogadas || 0
                            ),

                        erros:
                            Number(
                                data.erros || 0
                            )
                    });
                }
            );


            gmFirebaseTop5JSON =
                JSON.stringify(ranking);


            gmFirebaseLoadStatus = 2;


            console.log(
                "Top 5 global carregado:",
                ranking
            );
        })

        .catch(function(error)
        {
            gmFirebaseLoadStatus = -1;

            console.error(
                "Erro carregando Top 5:",
                error
            );
        });


    return 1;
}


function fb_get_load_status()
{
    return gmFirebaseLoadStatus;
}


function fb_get_top5_json()
{
    return gmFirebaseTop5JSON;
}


function fb_get_rank_status()
{
    return gmFirebaseRankStatus;
}


function fb_get_player_rank()
{
    return gmFirebasePlayerRank;
}



