from django.contrib import admin
from django.db.models import Count
from django.http import HttpResponse
from django.urls import path
from django.utils import timezone
from django.utils.html import format_html

from .models import PageVisit


def _build_dashboard_html(request):
    now = timezone.now()
    today = now.date()
    yesterday = today - timezone.timedelta(days=1)

    qs = PageVisit.objects.all()
    total = qs.count()
    hoje = qs.filter(created_at__date=today).count()
    ontem = qs.filter(created_at__date=yesterday).count()
    sete_dias = qs.filter(created_at__gte=now - timezone.timedelta(days=7)).count()
    trinta_dias = qs.filter(created_at__gte=now - timezone.timedelta(days=30)).count()

    top_pages = (
        qs.values("path")
        .annotate(total=Count("id"))
        .order_by("-total")[:15]
    )

    ultimos_7 = []
    for i in range(6, -1, -1):
        d = today - timezone.timedelta(days=i)
        cnt = qs.filter(created_at__date=d).count()
        ultimos_7.append((d.strftime("%d/%m"), cnt))

    max_cnt = max((c for _, c in ultimos_7), default=1) or 1

    def bar(cnt):
        pct = int(cnt / max_cnt * 100)
        return (
            f'<div style="display:flex;align-items:center;gap:8px;margin:4px 0">'
            f'<div style="width:200px;background:#e9ecef;border-radius:4px;height:20px">'
            f'<div style="width:{pct}%;background:#667eea;height:100%;border-radius:4px"></div></div>'
            f'<span style="font-weight:bold">{cnt}</span></div>'
        )

    rows_top = "".join(
        f'<tr><td style="padding:6px 12px;border-bottom:1px solid #eee">{i+1}.</td>'
        f'<td style="padding:6px 12px;border-bottom:1px solid #eee;font-family:monospace">{p["path"]}</td>'
        f'<td style="padding:6px 12px;border-bottom:1px solid #eee;font-weight:bold">{p["total"]}</td></tr>'
        for i, p in enumerate(top_pages)
    )

    rows_chart = "".join(
        f'<tr><td style="padding:4px 12px;white-space:nowrap">{label}</td>'
        f'<td style="padding:4px 12px">{bar(cnt)}</td></tr>'
        for label, cnt in ultimos_7
    )

    html = f"""<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="utf-8">
<title>Dashboard de Visitas — BurnyOut Admin</title>
<style>
  body {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background:#f8f9fa; margin:0; padding:24px; }}
  h1 {{ color:#333; }}
  .cards {{ display:flex; gap:16px; flex-wrap:wrap; margin:24px 0; }}
  .card {{ background:#fff; border-radius:8px; padding:20px 28px; box-shadow:0 1px 4px rgba(0,0,0,.1); min-width:140px; }}
  .card .num {{ font-size:2rem; font-weight:bold; color:#667eea; }}
  .card .label {{ color:#666; font-size:.85rem; margin-top:4px; }}
  table {{ background:#fff; border-radius:8px; box-shadow:0 1px 4px rgba(0,0,0,.1); border-collapse:collapse; width:100%; }}
  th {{ text-align:left; padding:10px 12px; background:#f1f3f5; color:#555; font-size:.8rem; text-transform:uppercase; }}
  a {{ color:#667eea; text-decoration:none; }}
  section {{ margin-bottom:32px; }}
  h2 {{ color:#444; font-size:1.1rem; margin-bottom:8px; }}
</style>
</head>
<body>
<p><a href="/admin/">← Voltar ao admin</a> &nbsp;|&nbsp; <a href="/admin/analytics/pagevisit/">Ver registros individuais</a></p>
<h1>📊 Dashboard de Visitas — BurnyOut</h1>

<div class="cards">
  <div class="card"><div class="num">{total}</div><div class="label">Total de visitas</div></div>
  <div class="card"><div class="num">{hoje}</div><div class="label">Hoje</div></div>
  <div class="card"><div class="num">{ontem}</div><div class="label">Ontem</div></div>
  <div class="card"><div class="num">{sete_dias}</div><div class="label">Últimos 7 dias</div></div>
  <div class="card"><div class="num">{trinta_dias}</div><div class="label">Últimos 30 dias</div></div>
</div>

<section>
<h2>Visitas por dia (últimos 7 dias)</h2>
<table>
<thead><tr><th>Dia</th><th>Visitas</th></tr></thead>
<tbody>{rows_chart}</tbody>
</table>
</section>

<section>
<h2>Top páginas mais visitadas</h2>
<table>
<thead><tr><th>#</th><th>Página</th><th>Visitas</th></tr></thead>
<tbody>{rows_top}</tbody>
</table>
</section>

<p style="color:#999;font-size:.8rem">Atualizado em: {now.strftime('%d/%m/%Y %H:%M')} UTC</p>
</body>
</html>"""
    return html


@admin.register(PageVisit)
class PageVisitAdmin(admin.ModelAdmin):
    list_display = ("path", "created_at", "referer_short", "user_agent_short")
    list_filter = ("created_at",)
    search_fields = ("path", "referer", "user_agent")
    readonly_fields = ("path", "referer", "user_agent", "ip_hash", "created_at")
    date_hierarchy = "created_at"

    def get_urls(self):
        urls = super().get_urls()
        custom = [
            path(
                "dashboard/",
                self.admin_site.admin_view(self.dashboard_view),
                name="analytics_pagevisit_dashboard",
            )
        ]
        return custom + urls

    def dashboard_view(self, request):
        return HttpResponse(_build_dashboard_html(request))

    def referer_short(self, obj):
        return obj.referer[:60] or "—"
    referer_short.short_description = "Referer"

    def user_agent_short(self, obj):
        return obj.user_agent[:60] or "—"
    user_agent_short.short_description = "User Agent"

    def changelist_view(self, request, extra_context=None):
        extra_context = extra_context or {}
        now = timezone.now()
        today = now.date()
        qs = self.get_queryset(request)
        extra_context["total_visitas"] = qs.count()
        extra_context["hoje"] = qs.filter(created_at__date=today).count()
        extra_context["sete_dias"] = qs.filter(
            created_at__gte=now - timezone.timedelta(days=7)
        ).count()
        extra_context["dashboard_url"] = "dashboard/"
        extra_context["top_paginas"] = (
            qs.values("path")
            .annotate(total=Count("id"))
            .order_by("-total")[:10]
        )
        return super().changelist_view(request, extra_context=extra_context)
