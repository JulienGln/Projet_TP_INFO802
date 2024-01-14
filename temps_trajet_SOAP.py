from spyne import Application, rpc, ServiceBase, Iterable, Unicode, Integer, Float
from spyne.protocol.soap import Soap11
from spyne.server.wsgi import WsgiApplication

class TrajetService(ServiceBase):
    @rpc(Float, Integer, Float, Float, _returns=Float)
    def calcul_trajet(ctx, distance, autonomie, vitesse_moyenne, tps_chargement):
        """Calcul le temps de trajet en fonction de la 
            distance et de l’autonomie des véhicules et en tenant compte du temps de 
            chargement et de la vitesse du véhicule"""
        if distance < autonomie:
            return distance / vitesse_moyenne
        else:
            nb_chargements = distance // autonomie
            return (nb_chargements * tps_chargement) + (distance / vitesse_moyenne)

application = Application([TrajetService],
    tns='spyne.examples.trajet',
    in_protocol=Soap11(validator='lxml'),
    out_protocol=Soap11()
)

if __name__ == '__main__':
    from wsgiref.simple_server import make_server
    wsgi_app = WsgiApplication(application)
    server = make_server('127.0.0.1', 8000, wsgi_app)
    # http://localhost:8000/?wsdl
    server.serve_forever()