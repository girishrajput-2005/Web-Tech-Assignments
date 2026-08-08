#include <iostream>
using namespace std;

int main()
{
    int n, a[20];

    cout << "Enter number of bits: ";
    cin >> n;

    cout << "Enter bits (0 or 1): ";
    for(int i = 0; i < n; i++)
        cin >> a[i];

    // Upper line (High level)
    for(int i = 0; i < n; i++)
    {
        if(a[i] == 1)
            cout << "___ ";
        else
            cout << "    ";
    }

    cout << endl;

    // Lower line (Low level)
    for(int i = 0; i < n; i++)
    {
        if(a[i] == 0)
            cout << "___ ";
        else
            cout << "    ";
    }

    cout << endl;

    return 0;
}
