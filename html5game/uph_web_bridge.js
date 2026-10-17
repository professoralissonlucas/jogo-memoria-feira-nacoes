// ========================================
// FULLSCREEN WEB
// ========================================

function web_toggle_fullscreen()
{
    try
    {
        // Entrar em fullscreen
        if (!document.fullscreenElement)
        {
            var elemento =
                document.documentElement;

            var pedido =
                elemento.requestFullscreen();

            if (pedido && pedido.catch)
            {
                pedido.catch(function(error)
                {
                    console.error(
                        "Erro entrando em fullscreen:",
                        error
                    );
                });
            }

            return 1;
        }

        // Sair do fullscreen
        else
        {
            var pedido_saida =
                document.exitFullscreen();

            if (
                pedido_saida
                &&
                pedido_saida.catch
            )
            {
                pedido_saida.catch(
                    function(error)
                    {
                        console.error(
                            "Erro saindo do fullscreen:",
                            error
                        );
                    }
                );
            }

            return 1;
        }
    }
    catch (e)
    {
        console.error(
            "Fullscreen indisponível:",
            e
        );

        return 0;
    }
}


// ========================================
// VERIFICA FULLSCREEN
// ========================================

function web_is_fullscreen()
{
    if (document.fullscreenElement)
    {
        return 1;
    }

    return 0;
}