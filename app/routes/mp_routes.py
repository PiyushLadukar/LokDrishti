"""
Endpoints:
    GET  /api/mps                    - list all MPs (with filters)
    GET  /api/mps/search?q=          - search by name
    GET  /api/mps/silent             - silent MPs
    GET  /api/mps/<name>             - single MP profile
    GET  /api/mps/compare?mp1=&mp2=  - compare two MPs
"""

from flask import Blueprint, request, jsonify
from app.services.mp_services import (
    get_all_mps,
    get_mp_by_name,
    search_mps,
    compare_mps,
    get_silent_mps
)

mp_bp = Blueprint("mp", __name__)


def get_pagination(request):
    try:
        page      = int(request.args.get("page", 1))
        page_size = int(request.args.get("page_size", 20))
        page_size = min(page_size, 100)  # cap at 100
    except ValueError:
        page, page_size = 1, 20
    return page, page_size

@mp_bp.route("/mps", methods=["GET"])
def list_mps():
    state      = request.args.get("state")
    party      = request.args.get("party")
    min_lci    = request.args.get("min_lci", type=float)
    silent     = request.args.get("silent", "false").lower() == "true"
    page, page_size = get_pagination(request)

    result = get_all_mps(
        state=state, party=party,
        min_lci=min_lci, silent_only=silent,
        page=page, page_size=page_size
    )
    return jsonify(result)

@mp_bp.route("/mps/search", methods=["GET"])
def search():
    q = request.args.get("q", "").strip()
    if not q:
        return jsonify({"error": "Query parameter 'q' is required."}), 400

    page, page_size = get_pagination(request)
    result = search_mps(q, page=page, page_size=page_size)
    return jsonify(result)



@mp_bp.route("/mps/silent", methods=["GET"])
def silent_mps():
    state = request.args.get("state")
    party = request.args.get("party")
    page, page_size = get_pagination(request)

    result = get_silent_mps(state=state, party=party,
                            page=page, page_size=page_size)
    return jsonify(result)

@mp_bp.route("/mps/compare", methods=["GET"])
def compare():
    mp1 = request.args.get("mp1", "").strip()
    mp2 = request.args.get("mp2", "").strip()

    if not mp1 or not mp2:
        return jsonify({"error": "Both 'mp1' and 'mp2' parameters are required."}), 400

    result = compare_mps(mp1, mp2)
    return jsonify(result)


@mp_bp.route("/mps/<string:name>", methods=["GET"])
def get_mp(name):
    result = get_mp_by_name(name)
    if "error" in result:
        return jsonify(result), 404
    return jsonify(result)