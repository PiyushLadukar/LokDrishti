"""
Endpoints:
    GET /api/rankings/national              - all MPs ranked nationally
    GET /api/rankings/state/<state>         - MPs ranked within a state
    GET /api/rankings/party/<party>         - MPs ranked within a party
    GET /api/rankings/leaderboard/state     - top MP from each state
    GET /api/rankings/leaderboard/party     - top MP from each party
    GET /api/rankings/percentile            - MPs in a percentile band
"""

from flask import Blueprint, request, jsonify
from app.services.ranking_services import (
    get_national_rankings,
    get_state_rankings,
    get_party_rankings,
    get_state_leaderboard,
    get_party_leaderboard,
    get_mps_by_percentile_band
)

ranking_bp = Blueprint("ranking", __name__)


def get_pagination(request):
    try:
        page      = int(request.args.get("page", 1))
        page_size = int(request.args.get("page_size", 20))
        page_size = min(page_size, 100)
    except ValueError:
        page, page_size = 1, 20
    return page, page_size

@ranking_bp.route("/rankings/national", methods=["GET"])
def national():
    top_n = request.args.get("top_n", type=int)
    page, page_size = get_pagination(request)
    result = get_national_rankings(top_n=top_n, page=page, page_size=page_size)
    return jsonify(result)

@ranking_bp.route("/rankings/state/<string:state>", methods=["GET"])
def state_ranking(state):
    top_n = request.args.get("top_n", type=int)
    page, page_size = get_pagination(request)
    result = get_state_rankings(state=state, top_n=top_n,
                                page=page, page_size=page_size)
    if "error" in result:
        return jsonify(result), 404
    return jsonify(result)

@ranking_bp.route("/rankings/party/<string:party>", methods=["GET"])
def party_ranking(party):
    top_n = request.args.get("top_n", type=int)
    page, page_size = get_pagination(request)
    result = get_party_rankings(party=party, top_n=top_n,
                                page=page, page_size=page_size)
    if "error" in result:
        return jsonify(result), 404
    return jsonify(result)

@ranking_bp.route("/rankings/leaderboard/state", methods=["GET"])
def state_leaderboard():
    result = get_state_leaderboard()
    return jsonify(result)

@ranking_bp.route("/rankings/leaderboard/party", methods=["GET"])
def party_leaderboard():
    result = get_party_leaderboard()
    return jsonify(result)

@ranking_bp.route("/rankings/percentile", methods=["GET"])
def percentile_band():
    try:
        min_p = float(request.args.get("min", 0))
        max_p = float(request.args.get("max", 100))
    except ValueError:
        return jsonify({"error": "min and max must be numbers between 0 and 100."}), 400

    if not (0 <= min_p <= 100) or not (0 <= max_p <= 100) or min_p > max_p:
        return jsonify({"error": "Invalid percentile range. Use 0–100, min <= max."}), 400

    page, page_size = get_pagination(request)
    result = get_mps_by_percentile_band(min_p, max_p, page=page, page_size=page_size)
    return jsonify(result)