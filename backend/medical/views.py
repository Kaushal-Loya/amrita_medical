from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from .models import Person
from .serializers import PersonSerializer
from django.http import HttpResponse

def home(request):
    return HttpResponse("Welcome to the Medical Site API!")


@api_view(["GET"])
def get_people(request):
    people = Person.objects.all()
    serializer = PersonSerializer(people, many=True)
    return Response(serializer.data)

@api_view(["POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def add_person(request):
    serializer = PersonSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["DELETE"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def delete_person(request, id):
    try:
        person = Person.objects.get(id=id)
        person.delete()
        return Response({"message": "Person deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    except Person.DoesNotExist:
        return Response({"error": "Person not found"}, status=status.HTTP_404_NOT_FOUND)
