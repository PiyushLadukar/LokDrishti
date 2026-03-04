
from flask import Blueprint, jsonify
from app.services.index_services import (
    get_state_strength_index,
    get_party_dominance_index,
    get_performance_inequality,
    get_representation_imbalance
)

index_bp = Blueprint("index", __name__)

@index_bp.route("/analytics/state-strength", methods=["GET"])
def state_strength():
    result = get_state_strength_index()
    return jsonify(result)

@index_bp.route("/analytics/party-dominance", methods=["GET"])
def party_dominance():
    result = get_party_dominance_index()
    return jsonify(result)

@index_bp.route("/analytics/inequality", methods=["GET"])
def inequality():
    result = get_performance_inequality()
    return jsonify(result)

@index_bp.route("/analytics/imbalance", methods=["GET"])
def imbalance():
    result = get_representation_imbalance()
    return jsonify(result)