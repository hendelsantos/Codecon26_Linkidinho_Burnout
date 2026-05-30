# 🚀 Funcionalidades planejadas — Burny Out

Documento de planejamento para implementação futura. Cada feature tem objetivo,
escopo, arquivos envolvidos e checklist.

---

## 1. 🎰 Roleta da Sexta-feira

### Objetivo
Botão de roleta estilo cassino que sorteia o "destino do fim de semana" do usuário.
Sempre dá ruim — humor corporativo. Alto impacto na demo (gera risada = lembrança).

### Comportamento
- Botão grande "Girar a Roleta da Sexta" (só habilitado às sextas? ou sempre, com aviso).
- Animação de roleta girando + som de cassino (opcional, com toggle de mudo).
- Resultado sorteado com pesos (probabilidades viciadas para sempre dar ruim):

| Resultado | Emoji | Peso |
|-----------|-------|------|
| Folga merecida! | 🎉 | 1% |
| Deploy emergencial às 23h de sábado | 💻 | 40% |
| Cliente ligou no domingo | 📞 | 30% |
| Produção caiu. Boa sorte. | 🔥 | 29% |

- Mostra mensagem dramática após o giro.
- (Opcional) Contador global: "Roletas giradas hoje: N".

### Escopo técnico
**Frontend** (`apps/frontend/src/app/`):
- Nova página `roleta/page.tsx` OU componente no dashboard.
- Animação com Framer Motion (rotação + easing).
- Lógica de sorteio ponderado no cliente.
- Som via `<audio>` (arquivo curto em `public/`), com fallback mudo.

**Backend** (opcional, só se quiser contador persistente):
- Endpoint `POST /api/roleta/girar/` que registra o giro e retorna resultado.
- Model `RoletaGiro` (usuário, resultado, timestamp) no app `social` ou novo app `fun`.
- Endpoint `GET /api/roleta/stats/` para o contador global.

### Checklist
- [ ] Definir lista de resultados + pesos
- [ ] Criar componente de roleta com animação
- [ ] Implementar sorteio ponderado
- [ ] Adicionar som (opcional)
- [ ] (Opcional) Persistir giros no backend + contador global
- [ ] Linkar no menu/dashboard
- [ ] Testar no mobile

### Estimativa
~1h (só frontend) / ~2h (com backend e contador).

---

## 2. 🖥️ Botão "Fingir que estou trabalhando"

### Objetivo
Botão que abre uma tela falsa de "trabalho intenso" (compilando, sincronizando
planilhas, barra de progresso infinita). Para quando o chefe passa atrás de você.
Inútil e cômico — crítica satírica ao presenteísmo.

### Comportamento
- Botão "Fingir que estou trabalhando" no dashboard.
- Ao clicar: abre **fullscreen** com aparência de terminal/IDE/planilha "séria".
- Textos falsos rotativos:
  - "Compilando módulo de sinergia... 47%"
  - "Sincronizando 14.302 planilhas..."
  - "Otimizando pipeline de entregas..."
  - "Aplicando hotfix crítico em produção..."
- Barra de progresso que **nunca chega a 100%** (trava em 99% e reseta).
- Tecla `ESC` ou clique discreto no canto → sai do modo.
- (Opcional) Modo "terminal hacker" com texto verde no preto rolando.

### Escopo técnico
**Frontend** apenas:
- Componente `FakeWorkOverlay.tsx` (modal fullscreen, z-index alto).
- Lista de mensagens falsas em loop com `setInterval`.
- Barra de progresso animada com lógica de "nunca completa".
- Listener de `keydown` (ESC) para fechar.

### Checklist
- [ ] Criar overlay fullscreen
- [ ] Lista de mensagens corporativas falsas
- [ ] Barra de progresso "infinita" (trava em 99%)
- [ ] Tecla ESC / botão discreto para sair
- [ ] (Opcional) Tema "terminal hacker"
- [ ] Linkar no dashboard
- [ ] Testar responsividade

### Estimativa
~30-45 min (só frontend).

---

## 3. ⚽ Módulo de Figurinhas da Copa do Mundo

### Objetivo
Módulo para controlar o álbum de figurinhas da Copa do Mundo **direto na rede**:
o usuário gerencia quais figurinhas tem, quais faltam (repetidas), e pode trocar
com outros usuários da plataforma.

> ⚠️ Nota: este módulo é temático e **independente** do burnout. Avaliar se entra
> como "easter egg" / módulo extra ou se vira projeto separado. Encaixa bem como
> "rede social" (combina com o feed que já existe).

### Comportamento
- **Meu álbum**: grade com todas as figurinhas (ex.: 0–680). Marca as que tenho.
- **Faltam**: lista das figurinhas que ainda não colei.
- **Repetidas**: figurinhas que tenho em duplicata (disponíveis para troca).
- **Trocas**: encontrar outros usuários cujas repetidas batem com as minhas faltas.
  - Matching automático: "Fulano tem a #123 que te falta e precisa da #456 que você tem".
- (Opcional) Notificação quando aparece uma troca compatível.
- (Opcional) Progresso do álbum: "Você completou 73% (497/680)".

### Modelo de dados (backend — novo app `figurinhas`)
```python
# apps/backend/figurinhas/models.py

class Figurinha(models.Model):
    """Catálogo oficial de figurinhas da Copa."""
    numero = models.PositiveIntegerField(unique=True)   # ex: 1..680
    nome = models.CharField(max_length=120)             # jogador/time/escudo
    time = models.CharField(max_length=80, blank=True)
    raridade = models.CharField(max_length=20, blank=True)  # comum, legend, etc.
    imagem_url = models.URLField(blank=True)

class ColecaoUsuario(models.Model):
    """Quais figurinhas cada usuário tem e quantas."""
    usuario = models.ForeignKey("users.Profile", on_delete=models.CASCADE,
                                related_name="figurinhas")
    figurinha = models.ForeignKey(Figurinha, on_delete=models.CASCADE)
    quantidade = models.PositiveIntegerField(default=1)  # >1 = repetida
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["usuario", "figurinha"],
                                    name="unique_figurinha_por_usuario")
        ]

class PropostaTroca(models.Model):
    """Proposta de troca entre dois usuários."""
    de_usuario = models.ForeignKey("users.Profile", on_delete=models.CASCADE,
                                   related_name="trocas_enviadas")
    para_usuario = models.ForeignKey("users.Profile", on_delete=models.CASCADE,
                                     related_name="trocas_recebidas")
    oferece = models.ManyToManyField(Figurinha, related_name="ofertas")
    pede = models.ManyToManyField(Figurinha, related_name="pedidos")
    status = models.CharField(max_length=20, default="pendente")  # pendente/aceita/recusada
    criado_em = models.DateTimeField(auto_now_add=True)
```

### Endpoints (DRF)
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/figurinhas/catalogo/` | Lista o catálogo completo |
| GET | `/api/figurinhas/minhas/` | Minha coleção (tenho/faltam/repetidas) |
| POST | `/api/figurinhas/colar/` | Marca figurinha como obtida (+1) |
| DELETE | `/api/figurinhas/colar/{numero}/` | Remove uma unidade |
| GET | `/api/figurinhas/trocas-sugeridas/` | Matching de repetidas x faltas |
| POST | `/api/figurinhas/propostas/` | Cria proposta de troca |
| POST | `/api/figurinhas/propostas/{id}/aceitar/` | Aceita troca |

### Frontend (`apps/frontend/src/app/figurinhas/`)
- `page.tsx` — visão do álbum (grade com tenho/faltam).
- Filtros: todas / faltam / repetidas.
- Tela de trocas sugeridas com matching.
- Barra de progresso do álbum.

### Lógica de matching de trocas
```
minhas_repetidas = {fig | quantidade > 1}
minhas_faltas    = {fig | não na coleção}

para cada outro_usuario:
    ele_oferece = repetidas_dele ∩ minhas_faltas
    ele_quer    = repetidas_minhas ∩ faltas_dele
    se ele_oferece e ele_quer:
        sugerir troca (mostrar interseções)
```

### Checklist
- [ ] Criar app Django `figurinhas`
- [ ] Models: Figurinha, ColecaoUsuario, PropostaTroca
- [ ] Migrations
- [ ] Seed do catálogo (CSV/JSON com numero+nome+time)
- [ ] Serializers + Views (catálogo, minhas, colar, trocas)
- [ ] Algoritmo de matching de trocas
- [ ] Frontend: página do álbum (grade)
- [ ] Frontend: filtros (faltam/repetidas)
- [ ] Frontend: tela de trocas sugeridas
- [ ] Barra de progresso do álbum
- [ ] (Opcional) Notificações de troca compatível
- [ ] Registrar rotas em `config/urls.py`
- [ ] Deploy + testes

### Estimativa
~4-6h (módulo completo com trocas) / ~2h (só meu álbum + faltam/repetidas, sem trocas).

### Dúvidas a resolver antes de começar
- [ ] Quantas figurinhas tem o álbum? (definir o range do catálogo)
- [ ] De onde vêm os dados oficiais (nomes/imagens)? CSV manual ou API externa?
- [ ] Trocas são automáticas (matching) ou manuais (usuário escolhe)?
- [ ] Entra como módulo do Burny Out ou projeto separado?

---

## Ordem sugerida de implementação

1. **Botão "Fingir que estou trabalhando"** — mais rápido, só frontend, alto retorno cômico.
2. **Roleta da Sexta-feira** — rápido, animação impactante para a demo.
3. **Módulo de Figurinhas** — maior esforço, planejar bem antes (responder as dúvidas acima).
